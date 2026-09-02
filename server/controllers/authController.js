const User = require('../models/User');
const PromoCode = require('../models/PromoCode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getWelcomeEmailTemplate } = require('../emailTemplates/welcomeEmail');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and phone number'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone: phone || undefined
        });

        // Generate unique welcome promo code (10% off, 1 time use, valid 30 days)
        const promoCodeString = `WELCOME10-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const promo = await PromoCode.create({
            code: promoCodeString,
            discountType: 'percentage',
            discountValue: 10,
            minimumOrderValue: 0,
            startsAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            usageLimit: 1,
            isActive: true
        });

        // Send Welcome Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Tohfabox25! Here is your 10% discount',
                message: `Hi ${user.name}, welcome to Tohfabox25! Use promo code ${promo.code} for 10% off your first order.`,
                html: getWelcomeEmailTemplate(user.name, promo.code)
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // We do not return an error here so the registration process continues successfully
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);

        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || error.keyValue || {})[0];
            const message = duplicateField === 'phone'
                ? 'This phone number is already registered'
                : 'User with this email already exists';
            return res.status(400).json({ success: false, message });
        }

        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors)[0]?.message || 'Please check the registration details';
            return res.status(400).json({ success: false, message });
        }

        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { identifier, email, password } = req.body;
        const loginId = identifier || email;

        // Validation
        if (!loginId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email/phone and password'
            });
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ 
            $or: [{ email: loginId }, { phone: loginId }] 
        }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                // : {
                //     user
                // _id: user._id,
                // name: user.name,
                // email: user.email,
                // role: user.role,
                // phone: user.phone
                // },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

exports.getAllRegisteredUsers = async (req, res) => {
    try {
        const users = await User.find();
        let filteresData = users.filter((item) => item?.role !== "admin")
        res.status(200).json({
            success: true,
            data: filteresData
        });
    } catch (error) {
        console.error('Get Users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users data',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { identifier } = req.body; // 'identifier' comes from the API request payload
        if (!identifier) {
            return res.status(400).json({ success: false, message: 'Please provide your email address' });
        }

        const user = await User.findOne({ email: identifier });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email address' });
        }

        console.log("object", user)
        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const frontendUrl = process.env.CLIENT_URL || 'https://tohfabox25.vercel.app' || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaec; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #4f46e5; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Tohfabox25</h1>
                </div>
                
                <h3 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Password Reset Request</h3>
                
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                    Hello <strong>${user.name || 'User'}</strong>,<br><br>
                    We received a request to reset the password associated with your account. 
                    If you made this request, please click the button below to choose a new password. 
                    For your security, this link will expire in exactly <strong>10 minutes</strong>.
                </p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);">
                        Reset Password
                    </a>
                </div>
                
                <p style="color: #6b7280; line-height: 1.6; font-size: 14px;">
                    If the button above does not work, you can copy and paste the following link into your web browser:<br>
                    <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                    If you did not request a password reset, please safely ignore this email. Your password will remain unchanged.<br><br>
                    &copy; ${new Date().getFullYear()} Tohfabox25. All rights reserved.
                </p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Tohfabox25 - Password Reset Instructions',
                message,
                html: emailHtml
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error('Email could not be sent', err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent', error: err.message });
        }
    } catch (error) {
        console.error('Forgot Password error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        if (!req.body.password) {
            return res.status(400).json({ success: false, message: 'Please provide a new password' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Reset Password error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};