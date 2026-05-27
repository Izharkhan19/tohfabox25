const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    getFeaturedProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:identifier', getProduct);

// Protected/Admin routes
router.post('/', protect, isAdmin, upload.array('images', 5), createProduct);
router.put('/:id', protect, isAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.delete('/:id/images/:imageId', protect, isAdmin, deleteProductImage);

module.exports = router;