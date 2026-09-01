const Order = require('../models/Order');
const Product = require('../models/Product');
const { findValidPromo, incrementPromoUsage } = require('./promoController');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

// const stripe = require("stripe")("")

// let makePayment = () => {
//     const { product, token } = req.body
//     console.log("PRODUCT", product)
//     console.log("PRODUCT PRICE", product.price)
//     const idempotencyKey = uuid()
//     return stripe.customers.create({
//         email: token.email,
//         source: token.id
//     }).then(customer => {
//         stripe.charges.create(
//             {
//                 amount: product.price * 100,
//                 currency: "usd",
//                 customer: customer.id,
//                 receipt_email: token.email,
//                 description: product.name,
//                 shipping: {
//                     name: token.card.name,
//                     address: {
//                         country: token.card.address_country,
//                     }
//                 },
//             },
//             { idempotencyKey })
//     }).then(result => {
//         res.status(200).json(result)
//     }).catch(err => console.log(err))
// }


// controllers/orderController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Product = require('../models/Product');
// const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            tax = 0,
            shippingCost = 0,
            discount = 0,
            promoCode,
            notes,
        } = req.body;

        // Validation (same as before)
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
        }
        if (!shippingAddress) {
            return res.status(400).json({ success: false, message: 'Shipping address is required' });
        }
        if (!paymentMethod) {
            return res.status(400).json({ success: false, message: 'Payment method is required' });
        }

        // Validate items & stock
        const orderItems = [];
        let calculatedSubtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            if (!product.isActive) return res.status(400).json({ success: false, message: `Product unavailable: ${product.name}` });
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images?.[0]?.url || null,
                price: product.price,
                quantity: item.quantity,
            });

            calculatedSubtotal += product.price * item.quantity;
            product.stock -= item.quantity;
            product.sales += item.quantity;
            await product.save();
        }

        let appliedDiscount = 0;
        if (promoCode) {
            try {
                appliedDiscount = (await findValidPromo(promoCode, calculatedSubtotal)).discount;
            } catch (error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }

        const total = calculatedSubtotal + tax + shippingCost - appliedDiscount;

        let paymentStatus = 'pending';
        let paymentDetails = {};

        if (paymentMethod === 'credit_card') {
            // Create PaymentIntent (modern way)
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100), // cents
                currency: 'inr', // Use INR for India
                payment_method_types: ['card'],
                metadata: {
                    userId: req.user._id.toString(),
                    orderItems: JSON.stringify(orderItems),
                },
            });
            console.log("paymentIntent", paymentIntent)
            // Return client_secret to frontend for confirmation
            return res.status(200).json({
                success: true,
                message: 'Payment intent created',
                clientSecret: paymentIntent.client_secret,
                orderData: {
                    items: orderItems,
                    shippingAddress,
                    paymentMethod,
                    subtotal: calculatedSubtotal,
                    tax,
                    shippingCost,
                    discount: appliedDiscount,
                    promoCode: promoCode?.trim().toUpperCase(),
                    total,
                    notes,
                },
            });
        } else {
            // COD: Create order directly
            const order = await Order.create({
                user: req.user._id,
                items: orderItems,
                shippingAddress,
                paymentMethod,
                subtotal: calculatedSubtotal,
                tax,
                shippingCost,
                discount: appliedDiscount,
                promoCode: promoCode?.trim().toUpperCase(),
                total,
                notes,
                paymentStatus: 'pending',
            });

            await incrementPromoUsage(promoCode);
            await order.populate('user', 'name email');
            return res.status(201).json({ success: true, message: 'Order created (COD)', data: order });
        }
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const { clientSecret, orderData } = req.body;

        // Extract PaymentIntent ID from clientSecret (format: pi_xxx_secret_yyy)
        const paymentIntentId = clientSecret.split('_secret_')[0];

        // Verify payment succeeded
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed',
            });
        }

        let confirmedDiscount = 0;
        if (orderData.promoCode) {
            try {
                confirmedDiscount = (await findValidPromo(orderData.promoCode, Number(orderData.subtotal))).discount;
            } catch (error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }

        // Create the order now that payment is confirmed
        const order = await Order.create({
            user: req.user._id,
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            subtotal: orderData.subtotal,
            tax: orderData.tax || 0,
            shippingCost: orderData.shippingCost || 0,
            discount: confirmedDiscount,
            promoCode: orderData.promoCode?.trim().toUpperCase(),
            total: Number(orderData.subtotal) + Number(orderData.tax || 0) + Number(orderData.shippingCost || 0) - confirmedDiscount,
            notes: orderData.notes || '',
            paymentStatus: 'paid',
            paymentDetails: {
                transactionId: paymentIntent.id,
                paidAt: new Date(paymentIntent.created * 1000),
            },
        });

        await incrementPromoUsage(orderData.promoCode);

        await order.populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Order confirmed and created successfully',
            data: order,
        });
    } catch (error) {
        console.error('Confirm order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming order',
            error: error.message,
        });
    }
};

// exports.createOrder = async (req, res) => {
//     try {
//         const {
//             items,
//             shippingAddress,
//             paymentMethod,
//             subtotal,
//             tax,
//             shippingCost,
//             discount,
//             notes
//         } = req.body;

//         // Validation
//         if (!items || items.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Order must contain at least one item'
//             });
//         }

//         if (!shippingAddress) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Shipping address is required'
//             });
//         }

//         if (!paymentMethod) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Payment method is required'
//             });
//         }

//         // Validate and prepare order items
//         const orderItems = [];
//         let calculatedSubtotal = 0;

//         for (const item of items) {
//             const product = await Product.findById(item.product);

//             if (!product) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Product not found: ${item.product}`
//                 });
//             }

//             if (!product.isActive) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Product is not available: ${product.name}`
//                 });
//             }

//             if (product.stock < item.quantity) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
//                 });
//             }

//             orderItems.push({
//                 product: product._id,
//                 name: product.name,
//                 image: product.images && product.images.length > 0 ? product.images[0].url : null,
//                 price: product.price,
//                 quantity: item.quantity
//             });

//             calculatedSubtotal += product.price * item.quantity;

//             // Update product stock and sales
//             product.stock -= item.quantity;
//             product.sales += item.quantity;
//             await product.save();
//         }

//         // Calculate total
//         const total = calculatedSubtotal + (tax || 0) + (shippingCost || 0) - (discount || 0);

//         // Create order
//         const order = await Order.create({
//             user: req.user._id,
//             items: orderItems,
//             shippingAddress,
//             paymentMethod,
//             subtotal: calculatedSubtotal,
//             tax: tax || 0,
//             shippingCost: shippingCost || 0,
//             discount: discount || 0,
//             total,
//             notes
//         });

//         await order.populate('user', 'name email');

//         res.status(201).json({
//             success: true,
//             message: 'Order created successfully',
//             data: order
//         });
//     } catch (error) {
//         console.error('Create order error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating order',
//             error: error.message
//         });
//     }
// };

// @desc    Get all orders (Admin) or user's orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const {
            status,
            paymentStatus,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sort = '-createdAt'
        } = req.query;

        // Build filter
        const filter = {};

        // If not admin, only show user's orders
        if (req.user.role !== 'admin') {
            filter.user = req.user._id;
        }

        if (status) {
            filter.status = status;
        }

        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const orders = await Order.find(filter)
            .populate('user', 'name email phone')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name slug');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, comment, trackingNumber, shippingCarrier } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        order.status = status;

        // Add to status history
        order.statusHistory.push({
            status,
            comment,
            updatedBy: req.user._id,
            timestamp: new Date()
        });

        // Update tracking info if provided
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (shippingCarrier) order.shippingCarrier = shippingCarrier;

        // Set delivered date if status is delivered
        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        // Set cancelled date if status is cancelled
        if (status === 'cancelled') {
            order.cancelledAt = new Date();
            if (comment) order.cancellationReason = comment;

            // Restore product stock
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    product.sales -= item.quantity;
                    await product.save();
                }
            }
        }

        await order.save();
        await order.populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus, transactionId } = req.body;

        if (!paymentStatus) {
            return res.status(400).json({
                success: false,
                message: 'Payment status is required'
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.paymentStatus = paymentStatus;

        if (transactionId) {
            order.paymentDetails.transactionId = transactionId;
        }

        if (paymentStatus === 'paid') {
            order.paymentDetails.paidAt = new Date();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (['delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled. Current status: ${order.status}`
            });
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        order.cancellationReason = reason;

        // Add to status history
        order.statusHistory.push({
            status: 'cancelled',
            comment: reason,
            updatedBy: req.user._id,
            timestamp: new Date()
        });

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                product.sales -= item.quantity;
                await product.save();
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const completedOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics',
            error: error.message
        });
    }
};

// @desc    Get monthly sales (Admin)
// @route   GET /api/orders/stats/monthly
// @access  Private/Admin
exports.getMonthlySales = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        const monthlySales = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$total" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const formattedSales = months.map((month, index) => {
            const found = monthlySales.find(item => item._id === index + 1);
            return {
                month,
                total: found ? found.total : 0
            };
        });

        res.status(200).json({
            success: true,
            data: formattedSales
        });
    } catch (error) {
        console.error('Get monthly sales error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly sales',
            error: error.message
        });
    }
};