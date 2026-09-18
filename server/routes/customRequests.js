const express = require('express');
const router = express.Router();
const CustomRequest = require('../models/CustomRequest');

// POST /api/custom-requests - Create a new request
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, type, message } = req.body;
        
        const newRequest = new CustomRequest({
            name,
            email,
            phone,
            type,
            message
        });
        
        await newRequest.save();
        
        res.status(201).json({
            success: true,
            data: newRequest,
            message: 'Your request has been submitted successfully.'
        });
    } catch (error) {
        console.error('Error submitting custom request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit request. Please try again.'
        });
    }
});

// GET /api/custom-requests - Get all requests (Admin)
router.get('/', async (req, res) => {
    try {
        const requests = await CustomRequest.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching custom requests:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// PUT /api/custom-requests/:id/status - Update status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'Reviewed', 'Closed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updatedRequest = await CustomRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({
            success: true,
            data: updatedRequest,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// DELETE /api/custom-requests/:id - Delete a request
router.delete('/:id', async (req, res) => {
    try {
        const request = await CustomRequest.findByIdAndDelete(req.params.id);
        
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
