const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Request type is required'],
    enum: ['Custom Order', 'Inquiry'],
    default: 'Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Closed'],
    default: 'Pending',
  },
  referenceImage: {
    url: String,
    publicId: String
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CustomRequest', customRequestSchema);
