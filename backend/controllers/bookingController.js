const { query, withTransaction } = require('../db');
const { mapBooking } = require('../db/mappers');

const bookingSelect = `
  SELECT
    b.id AS booking_id,
    b.service_id,
    b.provider_id,
    b.customer_id,
    b.booking_date,
    b.start_time,
    b.end_time,
    b.status,
    b.total_price,
    b.customer_notes,
    b.cancellation_reason,
    b.cancelled_by,
    b.cancelled_at,
    b.completed_at,
    b.created_at,
    b.updated_at,
    json_build_object(
      '_id', s.id,
      'id', s.id,
      'title', s.title,
      'images', COALESCE((SELECT json_agg(si.image_url ORDER BY si.sort_order) FROM service_images si WHERE si.service_id = s.id), '[]'::json),
      'price', s.price,
      'category', s.category
    ) AS service,
    json_build_object(
      '_id', provider.id,
      'id', provider.id,
      'displayName', provider.display_name,
      'email', provider.email,
      'phoneNumber', provider.phone_number,
      'profileImage', provider.profile_image
    ) AS provider,
    json_build_object(
      '_id', customer.id,
      'id', customer.id,
      'displayName', customer.display_name,
      'email', customer.email,
      'phoneNumber', customer.phone_number,
      'profileImage', customer.profile_image
    ) AS customer
  FROM bookings b
  JOIN services s ON s.id = b.service_id
  JOIN users provider ON provider.id = b.provider_id
  JOIN users customer ON customer.id = b.customer_id
`;

const getBookingRow = async (bookingId) => {
  const result = await query(`${bookingSelect} WHERE b.id = $1`, [bookingId]);
  return result.rows[0] || null;
};

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, startTime, endTime, customerNotes = '' } = req.body;

    const bookingId = await withTransaction(async (client) => {
      const serviceResult = await client.query(
        'SELECT id, provider_id, price FROM services WHERE id = $1 AND is_active = true FOR UPDATE',
        [serviceId]
      );
      const service = serviceResult.rows[0];

      if (!service) {
        const error = new Error('SERVICE_NOT_FOUND');
        error.status = 404;
        throw error;
      }

      // Serialize booking attempts for this service/date, then reject all time overlaps.
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1 || $2))', [serviceId, date]);
      const conflict = await client.query(
        `SELECT 1 FROM bookings
         WHERE service_id = $1
           AND booking_date = $2
           AND status <> 'cancelled'
           AND start_time < $4::time
           AND end_time > $3::time
         LIMIT 1`,
        [serviceId, date, startTime, endTime]
      );

      if (conflict.rowCount > 0) {
        const error = new Error('TIME_SLOT_UNAVAILABLE');
        error.status = 409;
        throw error;
      }

      const result = await client.query(
        `INSERT INTO bookings
          (service_id, provider_id, customer_id, booking_date, start_time, end_time, total_price, customer_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [serviceId, service.provider_id, req.userId, date, startTime, endTime, service.price, customerNotes]
      );

      await client.query(
        'UPDATE services SET total_bookings = total_bookings + 1 WHERE id = $1',
        [serviceId]
      );

      return result.rows[0].id;
    });

    const booking = await getBookingRow(bookingId);
    res.status(201).json({
      success: true,
      message: '✅ Booking created successfully',
      booking: mapBooking(booking)
    });
  } catch (error) {
    if (error.message === 'SERVICE_NOT_FOUND') {
      return res.status(404).json({ success: false, message: '❌ Service not found' });
    }
    if (error.message === 'TIME_SLOT_UNAVAILABLE') {
      return res.status(409).json({ success: false, message: '❌ This time slot overlaps an existing booking' });
    }
    console.error('Create booking error:', error.message);
    res.status(400).json({ success: false, message: '❌ Error creating booking' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const column = req.userRole === 'provider' ? 'b.provider_id' : 'b.customer_id';
    const result = await query(`${bookingSelect} WHERE ${column} = $1 ORDER BY b.created_at DESC`, [req.userId]);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      bookings: result.rows.map(mapBooking)
    });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching bookings' });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const row = await getBookingRow(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: '❌ Booking not found' });

    if (row.customer_id !== req.userId && row.provider_id !== req.userId) {
      return res.status(403).json({ success: false, message: '❌ Not authorized to view this booking' });
    }

    res.status(200).json({ success: true, booking: mapBooking(row) });
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching booking' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled']);
    if (!allowedStatuses.has(status)) {
      return res.status(400).json({ success: false, message: '❌ Invalid booking status' });
    }

    const existing = await getBookingRow(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: '❌ Booking not found' });
    if (existing.provider_id !== req.userId) {
      return res.status(403).json({ success: false, message: '❌ Only provider can update booking status' });
    }
    if (existing.status === 'cancelled' || existing.status === 'completed') {
      return res.status(409).json({ success: false, message: '❌ This booking is already finalized' });
    }

    const result = await query(
      `UPDATE bookings
       SET status = $1,
           completed_at = CASE WHEN $1 = 'completed' THEN now() ELSE completed_at END
       WHERE id = $2 AND provider_id = $3
       RETURNING id`,
      [status, req.params.id, req.userId]
    );

    const updated = await getBookingRow(result.rows[0].id);
    res.status(200).json({
      success: true,
      message: '✅ Booking status updated successfully',
      booking: mapBooking(updated)
    });
  } catch (error) {
    console.error('Update booking status error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error updating booking status' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason = '' } = req.body;
    const result = await query(
      `UPDATE bookings
       SET status = 'cancelled',
           cancellation_reason = $1,
           cancelled_by = $2,
           cancelled_at = now()
       WHERE id = $3
         AND (customer_id = $4 OR provider_id = $4)
         AND status IN ('pending', 'confirmed')
       RETURNING id`,
      [cancellationReason, req.userRole, req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: '❌ Booking not found or cannot be cancelled' });
    }

    const booking = await getBookingRow(result.rows[0].id);
    res.status(200).json({ success: true, message: '✅ Booking cancelled successfully', booking: mapBooking(booking) });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error cancelling booking' });
  }
};
