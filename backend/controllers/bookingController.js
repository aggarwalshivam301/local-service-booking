const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, startTime, endTime, customerNotes } = req.body;

    // Get service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: '❌ Service not found'
      });
    }

    // Check if time slot is available
    const bookingDate = new Date(date);
    const existingBooking = await Booking.findOne({
      serviceId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      },
      startTime,
      status: { $nin: ['cancelled'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: '❌ This time slot is already booked'
      });
    }

    // Create booking
    const booking = await Booking.create({
      serviceId,
      providerId: service.providerId,
      customerId: req.userId,
      date: bookingDate,
      startTime,
      endTime,
      totalPrice: service.price,
      customerNotes
    });

    // Update service booking count
    service.totalBookings += 1;
    await service.save();

    // Populate before returning
    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'title price')
      .populate('providerId', 'displayName email phoneNumber')
      .populate('customerId', 'displayName email phoneNumber');

    res.status(201).json({
      success: true,
      message: '✅ Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error creating booking',
      error: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    let query = {};

    if (req.userRole === 'customer') {
      query.customerId = req.userId;
    } else if (req.userRole === 'provider') {
      query.providerId = req.userId;
    }

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title images price category')
      .populate('customerId', 'displayName email phoneNumber profileImage')
      .populate('providerId', 'displayName email phoneNumber profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('customerId')
      .populate('providerId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: '❌ Booking not found'
      });
    }

    // Check authorization
    if (booking.customerId._id.toString() !== req.userId.toString() &&
        booking.providerId._id.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '❌ Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: '❌ Booking not found'
      });
    }

    // Check authorization
    if (booking.providerId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '❌ Only provider can update booking status'
      });
    }

    booking.status = status;
    if (status === 'completed') {
      booking.completedAt = new Date();
    }
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'title')
      .populate('customerId', 'displayName email');

    res.status(200).json({
      success: true,
      message: '✅ Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error updating booking status',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: '❌ Booking not found'
      });
    }

    // Check authorization
    if (booking.customerId.toString() !== req.userId.toString() &&
        booking.providerId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '❌ Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason || '';
    booking.cancelledBy = req.userRole;
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: '✅ Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error cancelling booking',
      error: error.message
    });
  }
};
