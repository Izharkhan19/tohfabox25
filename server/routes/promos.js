const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const {
    validatePromo,
    listPromos,
    createPromo,
    updatePromo,
    deletePromo
} = require('../controllers/promoController');

router.post('/validate', protect, validatePromo);
router.get('/', protect, isAdmin, listPromos);
router.post('/', protect, isAdmin, createPromo);
router.put('/:id', protect, isAdmin, updatePromo);
router.delete('/:id', protect, isAdmin, deletePromo);

module.exports = router;
