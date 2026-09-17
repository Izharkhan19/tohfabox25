const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// @desc    Send an email
// @route   POST /api/email/send
// @access  Public
exports.sendEmailController = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    const { recipient, subject, message } = req.body;

    try {
        await sendEmail({
            email: recipient,
            subject: subject,
            message: message,
            html: `<p>${message.replace(/\\n/g, '<br>')}</p>`
        });

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Email sending failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send email. Ensure SMTP configuration is correct and ports are accessible.'
        });
    }
};
