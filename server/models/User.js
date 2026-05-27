// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Name is required'],
//         trim: true,
//         minlength: [2, 'Name must be at least 2 characters'],
//         maxlength: [50, 'Name cannot exceed 50 characters']
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: true,
//         lowercase: true,
//         trim: true,
//         match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//         minlength: [6, 'Password must be at least 6 characters'],
//         select: false
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'user'
//     },
//     phone: {
//         type: String,
//         trim: true
//     },
//     address: {
//         street: String,
//         city: String,
//         state: String,
//         zipCode: String,
//         country: String
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     lastLogin: {
//         type: Date
//     }
// }, {
//     timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// // Remove password from JSON output
// userSchema.methods.toJSON = function () {
//     const obj = this.toObject();
//     delete obj.password;
//     return obj;
// };

// module.exports = mongoose.model('User', userSchema);


// models/User.js
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // New: Profile picture (Cloudinary URL)
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150?text=User'
    },

    phone: {
        type: String,
        trim: true,
        sparse: true // Allows null but unique if exists
    },

    // Shipping address (can be multiple later)
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: true }
    },

    // Wishlist — real product references!
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    // Cart — stores product + quantity
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            default: 1
        }
    }],

    // Email verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date // For account lockout after failed logins

}, {
    timestamps: true,
    // createdAt, updatedAt
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpires;
    delete user.loginAttempts;
    delete user.lockUntil;
    return user;
};

// Virtual: Check if account is locked
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('User', userSchema);