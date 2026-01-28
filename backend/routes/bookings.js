const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking, validate } = require('../utils/validators');
const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

const router = express.Router();

// Protected routes (Customer only)
router.post('/', protect, authorize('customer'), validateBooking, validate, createBooking);

// Protected routes (Any authenticated user)
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);

// Protected routes (Provider only)
router.put('/:id/status', protect, authorize('provider'), updateBookingStatus);

// Protected routes (Any authenticated user - customer or provider)
router.delete('/:id', protect, cancelBooking);

module.exports = router;
