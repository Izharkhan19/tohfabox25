const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const {
    getAnnouncements,
    getActiveAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/announcementController');

router.route('/')
    .get(protect, isAdmin, getAnnouncements)
    .post(protect, isAdmin, createAnnouncement);

router.route('/active')
    .get(getActiveAnnouncement);

router.route('/:id')
    .put(protect, isAdmin, updateAnnouncement)
    .delete(protect, isAdmin, deleteAnnouncement);

module.exports = router;
