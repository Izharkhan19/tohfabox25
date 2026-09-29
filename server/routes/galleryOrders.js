const express = require('express');
const router = express.Router();
const GalleryOrder = require('../models/GalleryOrder');
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// POST /api/gallery-orders - Place a quick order (Public)
router.post('/', async (req, res) => {
    try {
        const { galleryItemId, name, phone, address, quantity, notes } = req.body;

        if (!galleryItemId || !name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'galleryItemId, name, and phone are required'
            });
        }

        // Fetch gallery item for price info
        const galleryItem = await Gallery.findById(galleryItemId);
        if (!galleryItem || !galleryItem.isActive) {
            return res.status(404).json({ success: false, message: 'Gallery item not found or inactive' });
        }

        const qty = Number(quantity) || 1;
        const price = Number(galleryItem.price) || 0;

        const order = await GalleryOrder.create({
            galleryItemId,
            productTitle: galleryItem.title,
            productImage: galleryItem.image?.url,
            name: name.trim(),
            phone: phone.trim(),
            address: address?.trim() || '',
            quantity: qty,
            price,
            totalPrice: price * qty,
            notes: notes?.trim() || '',
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully! Our team will contact you shortly.',
            data: order
        });
    } catch (error) {
        console.error('Gallery order error:', error);
        res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
    }
});

// GET /api/gallery-orders - Get all orders (Admin)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const orders = await GalleryOrder.find()
            .populate('galleryItemId', 'title image')
            .sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// PUT /api/gallery-orders/:id/status - Update status (Admin)
router.put('/:id/status', protect, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const order = await GalleryOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, message: 'Status updated', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// DELETE /api/gallery-orders/:id - Delete order (Admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const order = await GalleryOrder.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

module.exports = router;
