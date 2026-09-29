const Gallery = require('../models/Gallery');
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require('../config/googleDrive');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getGalleryItems = async (req, res) => {
    try {
        const { isActive } = req.query;
        let filter = {};
        
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        } else {
            filter.isActive = true; // By default only active items
        }

        const items = await Gallery.find(filter).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        console.error('Get gallery items error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery items',
            error: error.message
        });
    }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('Get gallery item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery item',
            error: error.message
        });
    }
};

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private/Admin
exports.createGalleryItem = async (req, res) => {
    try {
        const { title, description, price, isActive } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a title'
            });
        }

        const galleryData = {
            title,
            description,
            price: price || 0,
            isActive: isActive !== undefined ? isActive : true
        };

        if (req.file) {
            const imageUpload = await uploadToGoogleDrive(req.file.path);
            galleryData.image = {
                url: imageUpload.url,
                publicId: imageUpload.publicId
            };
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide an image'
            });
        }

        const item = await Gallery.create(galleryData);

        res.status(201).json({
            success: true,
            message: 'Gallery item created successfully',
            data: item
        });
    } catch (error) {
        console.error('Create gallery item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating gallery item',
            error: error.message
        });
    }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
exports.updateGalleryItem = async (req, res) => {
    try {
        let item = await Gallery.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        const { title, description, price, isActive } = req.body;

        if (title) item.title = title;
        if (description !== undefined) item.description = description;
        if (price !== undefined) item.price = price;
        if (isActive !== undefined) item.isActive = isActive;

        if (req.file) {
            // Delete old image
            if (item.image && item.image.publicId) {
                await deleteFromGoogleDrive(item.image.publicId);
            }

            // Upload new image
            const imageUpload = await uploadToGoogleDrive(req.file.path);
            item.image = {
                url: imageUpload.url,
                publicId: imageUpload.publicId
            };
        }

        await item.save();

        res.status(200).json({
            success: true,
            message: 'Gallery item updated successfully',
            data: item
        });
    } catch (error) {
        console.error('Update gallery item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating gallery item',
            error: error.message
        });
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        // Delete image from Google Drive
        if (item.image && item.image.publicId) {
            await deleteFromGoogleDrive(item.image.publicId);
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Gallery item deleted successfully'
        });
    } catch (error) {
        console.error('Delete gallery item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting gallery item',
            error: error.message
        });
    }
};
