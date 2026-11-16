const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Load environment variables
dotenv.config();

// Force Node.js to use IPv4 first, solving ENETUNREACH errors on platforms like Render
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// Production Environment Validation
if (process.env.NODE_ENV === 'production') {
    const requiredEnvs = ['JWT_SECRET', 'MONGODB_URI', 'CLIENT_URL'];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    if (missingEnvs.length > 0) {
        console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingEnvs.join(', ')}`);
        process.exit(1);
    }
}

// Initialize external services
// No external services currently running locally (Redis and RabbitMQ removed)

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist')
const cartRoutes = require('./routes/cart')
const promoRoutes = require('./routes/promos');
const emailRoutes = require('./routes/email');
const customRequestRoutes = require('./routes/customRequests');

const app = express();

// Middleware

// 1. CORS configuration (Must be first to handle Preflight properly)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://tohfabox25.vercel.app',
  'https://artistarycrafts.vercel.app',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// Trust proxy if you are behind a reverse proxy (e.g. Render, Heroku, AWS, Nginx)
// This is important for the Rate Limiter to get the correct IP address of the client
app.set('trust proxy', 1);

// Middleware

// 1. Set Security HTTP Headers
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow local images to be loaded
}));

// 2. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 3. Data Sanitization against XSS
app.use(xss());

app.use(express.json({ limit: '10mb' })); // Limit body size for security
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route (Exempt from all rate limiters so uptime monitors and keep-alive pings never fail)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// High-Throughput Rate Limiting for standard browsing routes (5,000 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased from 100 to 5000 to easily support 1,000-2,000 concurrent browsing users
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', apiLimiter);

// Strict Rate Limiting for sensitive authentication endpoints (prevent brute-force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// Strict Rate Limiting for order submission endpoints (prevent order spam)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Max 60 order submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many order requests. Please try again after a few minutes.'
  }
});

// Edge & Browser Caching middleware for static catalog GET requests
// (Enables Cloudflare / Vercel Edge caching for 60s with stale-while-revalidate for 300s)
const catalogCacheControl = (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  }
  next();
};

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB Connected');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Specific strict rate limits
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/orders', orderLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', catalogCacheControl, productRoutes);
app.use('/api/categories', catalogCacheControl, categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/gallery', catalogCacheControl, require('./routes/gallery'));
app.use('/api/gallery-orders', require('./routes/galleryOrders'));
app.use('/api/announcements', catalogCacheControl, require('./routes/announcementRoutes'));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            orders: '/api/orders'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL || 'https://tohfabox25.onrender.com/api/health';
const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;

const pingKeepAliveUrl = async () => {
    try {
        const response = await fetch(KEEP_ALIVE_URL, {
            signal: AbortSignal.timeout(10000),
        });

        console.log(`Keep-alive ping: ${response.status}`);
    } catch (error) {
        console.warn(`Keep-alive ping failed: ${error.message}`);
    }
};

// WhatsApp client is now initialized in the MongoDB connection callback

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API ready at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api`);

    if (process.env.NODE_ENV === 'production') {
        setInterval(pingKeepAliveUrl, KEEP_ALIVE_INTERVAL_MS);
        console.log(`Keep-alive enabled: pinging ${KEEP_ALIVE_URL} every 10 minutes`);
    }
});