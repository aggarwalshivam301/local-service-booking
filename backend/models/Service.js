const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['cleaning', 'plumbing', 'electrical', 'beauty', 'tutoring', 'repair', 'other'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    priceType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed'
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      default: 60
    },
    images: [{
      type: String,
      default: 'https://via.placeholder.com/300'
    }],
    location: {
      city: String,
      state: String,
      address: String
    },
    availability: [{
      date: Date,
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [{
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    totalBookings: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
serviceSchema.index({ providerId: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ 'location.city': 1 });
serviceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
