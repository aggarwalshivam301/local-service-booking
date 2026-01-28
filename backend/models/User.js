const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['customer', 'provider'],
      default: 'customer'
    },
    profileImage: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    // For providers
    businessName: {
      type: String,
      default: ''
    },
    businessDescription: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
