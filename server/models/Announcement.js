const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Announcement message is required'],
        trim: true,
        maxlength: [200, 'Message cannot exceed 200 characters']
    },
    link: {
        type: String,
        trim: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
