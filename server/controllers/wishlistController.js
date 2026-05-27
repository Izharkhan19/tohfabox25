// controllers/wishlistController.js
const User = require('../models/User');

exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: productId }
    });

    res.json({ success: true, message: "Added to wishlist" });
};

exports.removeFromWishlist = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId }
    });
    res.json({ success: true, message: "Removed from wishlist" });
};

exports.getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, data: user.wishlist });
};

exports.clearWishlist = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { wishlist: [] });
    res.json({ success: true, message: "Wishlist cleared" });
};