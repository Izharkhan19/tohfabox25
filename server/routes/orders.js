const express = require('express');
const router = express.Router();
const {
    createOrder,
    createWhatsAppOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderStats,
    getMonthlySales,
    confirmOrder
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// WhatsApp / External order route (supports both logged-in users and guests)
router.post('/whatsapp', optionalAuth, createWhatsAppOrder);

// Protected routes (require authentication)
router.post('/', protect, createOrder);
router.post('/confirm', protect, confirmOrder); // New route
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only routes
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.put('/:id/payment', protect, isAdmin, updatePaymentStatus);
router.get('/stats/overview', protect, isAdmin, getOrderStats);
router.get('/stats/monthly', protect, isAdmin, getMonthlySales);

module.exports = router;