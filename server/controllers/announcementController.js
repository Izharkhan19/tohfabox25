const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort('-createdAt');
        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get active announcement (for client)
// @route   GET /api/announcements/active
// @access  Public
exports.getActiveAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findOne({ isActive: true }).sort('-createdAt');
        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
    try {
        const { message, link, isActive } = req.body;
        
        // If this one is active, we might want to deactivate others
        if (isActive) {
            await Announcement.updateMany({}, { isActive: false });
        }

        const announcement = await Announcement.create({ message, link, isActive });
        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res) => {
    try {
        let announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        const { message, link, isActive } = req.body;
        
        if (isActive && !announcement.isActive) {
            await Announcement.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
        }

        announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { message, link, isActive },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        await announcement.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
