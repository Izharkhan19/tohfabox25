// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

// Check if user is admin or the resource owner
exports.isAdminOrOwner = (resourceUserIdField = 'user') => {
    return (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        // Check if user owns the resource
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

        if (req.user && req.user._id.toString() === resourceUserId.toString()) {
            return next();
        }

        res.status(403).json({
            success: false,
            message: 'Access denied. You do not have permission to access this resource.'
        });
    };
};