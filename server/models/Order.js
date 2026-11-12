const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    guestCustomer: {
        name: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        }
    },
    orderSource: {
        type: String,
        enum: ['website', 'whatsapp', 'instagram', 'phone', 'other'],
        default: 'website'
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: {
            type: String
        },
        phone: {
            type: String
        },
        street: {
            type: String
        },
        apartment: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zipCode: {
            type: String
        },
        country: {
            type: String
        }
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'bank_transfer', 'razorpay', 'whatsapp', 'other'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDetails: {
        transactionId: String,
        paidAt: Date,
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    promoCode: {
        type: String,
        trim: true,
        uppercase: true
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        comment: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedVia: {
            type: String,
            enum: ['website', 'admin', 'whatsapp', 'other'],
            default: 'admin'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    trackingNumber: String,
    shippingCarrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    notes: String,
    cancelledAt: Date,
    cancellationReason: String
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD-${year}-${random}`;
    }
    next();
});

// Add initial status to history on creation if not already provided
orderSchema.pre('save', function (next) {
    if (this.isNew && this.statusHistory.length === 0) {
        this.statusHistory.push({
            status: this.status,
            updatedVia: this.orderSource === 'whatsapp' ? 'whatsapp' : 'website',
            timestamp: new Date()
        });
    }
    next();
});

// Calculate total automatically
orderSchema.pre('save', function (next) {
    if (this.isModified('subtotal') || this.isModified('tax') || this.isModified('shippingCost') || this.isModified('discount')) {
        this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
    }
    next();
});

// Virtual for item count
orderSchema.virtual('itemCount').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);