// controllers/cartController.js
const User = require('../models/User');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.json({
            success: true,
            data: user.cart || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items in stock`
            });
        }

        const user = await User.findById(req.user._id);

        const existingItemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        await user.populate('cart.product');

        res.status(200).json({
            success: true,
            message: "Added to cart",
            data: user.cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add to cart",
            error: error.message
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const user = await User.findById(req.user._id);
        const itemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not in cart"
            });
        }

        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available`
            });
        }

        user.cart[itemIndex].quantity = quantity;
        await user.save();
        await user.populate('cart.product');

        res.json({
            success: true,
            message: "Cart updated",
            data: user.cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { cart: { product: productId } } },
            { new: true }
        ).populate('cart.product');

        const user = await User.findById(req.user._id).populate('cart.product');

        res.json({
            success: true,
            message: "Removed from cart",
            data: user.cart || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove item",
            error: error.message
        });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { cart: [] });

        res.json({
            success: true,
            message: "Cart cleared successfully",
            data: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message
        });
    }
};