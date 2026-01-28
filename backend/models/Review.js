const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ customerId: 1 });
reviewSchema.index({ providerId: 1 });

// Prevent duplicate reviews from same user on same service
reviewSchema.index({ serviceId: 1, customerId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
