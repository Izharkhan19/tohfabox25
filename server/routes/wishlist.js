// routes/wishlist.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    clearWishlist
} = require('../controllers/wishlistController');

router.use(protect); // All routes require login

router.route('/')
    .get(getWishlist)
    .post(addToWishlist)
    .delete(clearWishlist);

router.route('/:productId')
    .delete(removeFromWishlist);

module.exports = router;