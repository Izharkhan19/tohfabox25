const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

const updateProductRating = async (productId) => {
    const summary = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        {
            $group: {
                _id: '$product',
                average: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    const rating = summary[0]
        ? { average: Math.round(summary[0].average * 10) / 10, count: summary[0].count }
        : { average: 0, count: 0 };

    await Product.findByIdAndUpdate(productId, { rating });
    return rating;
};

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};

exports.createOrUpdateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const numericRating = Number(rating);

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be a whole number from 1 to 5' });
        }

        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const review = await Review.findOneAndUpdate(
            { product: product._id, user: req.user._id },
            { rating: numericRating, comment: comment || '' },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        ).populate('user', 'name');

        const productRating = await updateProductRating(product._id);

        res.status(200).json({
            success: true,
            message: 'Rating saved successfully',
            data: { review, rating: productRating }
        });
    } catch (error) {
        console.error('Save review error:', error);
        res.status(500).json({ success: false, message: 'Error saving rating' });
    }
};
