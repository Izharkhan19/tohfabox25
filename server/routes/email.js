const express = require('express');
const router = express.Router();
const { sendEmailController } = require('../controllers/emailController');
const { check } = require('express-validator');

router.post(
    '/send',
    [
        check('recipient', 'Please include a valid email').isEmail().normalizeEmail(),
        check('subject', 'Subject is required').not().isEmpty().trim().escape(),
        check('message', 'Message is required').not().isEmpty().trim().escape()
    ],
    sendEmailController
);

module.exports = router;
