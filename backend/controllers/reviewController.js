const Review = require('../models/Review');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Add review to service
// @route   POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: '❌ Service not found'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      serviceId,
      customerId: req.userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: '❌ You have already reviewed this service'
      });
    }

    // Create review
    const review = await Review.create({
      serviceId,
      customerId: req.userId,
      providerId: service.providerId,
      rating,
      comment
    });

    // Update service rating
    const allReviews = await Review.find({ serviceId });
    const averageRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;

    service.rating = Math.round(averageRating * 10) / 10;
    service.reviews.push({
      customerId: req.userId,
      rating,
      comment,
      createdAt: new Date()
    });
    await service.save();

    // Update user rating (provider)
    const providerReviews = await Review.find({ providerId: service.providerId });
    const providerAverageRating = providerReviews.reduce((sum, rev) => sum + rev.rating, 0) / providerReviews.length;

    await User.findByIdAndUpdate(
      service.providerId,
      {
        rating: Math.round(providerAverageRating * 10) / 10,
        totalReviews: providerReviews.length
      }
    );

    const populatedReview = await Review.findById(review._id)
      .populate('customerId', 'displayName profileImage')
      .populate('serviceId', 'title');

    res.status(201).json({
      success: true,
      message: '✅ Review added successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error adding review',
      error: error.message
    });
  }
};

// @desc    Get all reviews for a service
// @route   GET /api/reviews/service/:serviceId
exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate('customerId', 'displayName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get all reviews for a provider
// @route   GET /api/reviews/provider/:providerId
exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'displayName profileImage')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get provider reviews error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: '❌ Review not found'
      });
    }

    // Check authorization
    if (review.customerId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '❌ Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update service rating
    const service = await Service.findById(review.serviceId);
    const remainingReviews = await Review.find({ serviceId: review.serviceId });
    
    if (remainingReviews.length > 0) {
      const averageRating = remainingReviews.reduce((sum, rev) => sum + rev.rating, 0) / remainingReviews.length;
      service.rating = Math.round(averageRating * 10) / 10;
    } else {
      service.rating = 0;
    }
    await service.save();

    res.status(200).json({
      success: true,
      message: '✅ Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error deleting review',
      error: error.message
    });
  }
};
