const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected/Admin routes
router.post('/', protect, isAdmin, upload.single('image'), createCategory);
router.put('/:id', protect, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;