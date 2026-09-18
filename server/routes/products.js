const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    deleteProductImage,
    getFeaturedProducts
} = require('../controllers/productController');
const { getProductReviews, createOrUpdateReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { upload } = require('../config/googleDrive');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createOrUpdateReview);
router.get('/:identifier', getProduct);

// Protected/Admin routes
router.post('/bulk-delete', protect, isAdmin, deleteMultipleProducts);
router.post('/', protect, isAdmin, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 4 }]), createProduct);
router.put('/:id', protect, isAdmin, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 4 }]), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.delete('/:id/images/:imageId', protect, isAdmin, deleteProductImage);

module.exports = router;