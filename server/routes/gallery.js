const express = require('express');
const router = express.Router();
const {
    getGalleryItems,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItem);

// Admin routes
router.post('/', protect, isAdmin, upload.single('image'), createGalleryItem);
router.put('/:id', protect, isAdmin, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, isAdmin, deleteGalleryItem);

module.exports = router;
