const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validateReview, validate } = require('../utils/validators');
const {
  addReview,
  getServiceReviews,
  getProviderReviews,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

// Protected routes (Customer only)
router.post('/', protect, authorize('customer'), validateReview, validate, addReview);
router.delete('/:id', protect, authorize('customer'), deleteReview);

// Public routes
router.get('/service/:serviceId', getServiceReviews);
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;
