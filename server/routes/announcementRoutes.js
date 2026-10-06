const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    getAnnouncements,
    getActiveAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/announcementController');

router.route('/')
    .get(protect, admin, getAnnouncements)
    .post(protect, admin, createAnnouncement);

router.route('/active')
    .get(getActiveAnnouncement);

router.route('/:id')
    .put(protect, admin, updateAnnouncement)
    .delete(protect, admin, deleteAnnouncement);

module.exports = router;
