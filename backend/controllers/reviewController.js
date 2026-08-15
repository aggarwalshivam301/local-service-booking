const { query, withTransaction } = require('../db');
const { mapReview } = require('../db/mappers');

const reviewSelect = `
  SELECT
    r.id AS review_id,
    r.service_id,
    r.customer_id,
    r.provider_id,
    r.rating,
    r.comment,
    r.created_at,
    r.updated_at,
    json_build_object(
      '_id', c.id,
      'id', c.id,
      'displayName', c.display_name,
      'profileImage', c.profile_image
    ) AS customer,
    json_build_object('_id', s.id, 'id', s.id, 'title', s.title) AS service
  FROM reviews r
  JOIN users c ON c.id = r.customer_id
  JOIN services s ON s.id = r.service_id
`;

const refreshAggregates = async (client, serviceId, providerId) => {
  await client.query(
    `UPDATE services
     SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE service_id = $1), 0)
     WHERE id = $1`,
    [serviceId]
  );

  await client.query(
    `UPDATE users
     SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE provider_id = $1), 0),
         total_reviews = (SELECT COUNT(*) FROM reviews WHERE provider_id = $1)
     WHERE id = $1`,
    [providerId]
  );
};

exports.addReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    const reviewId = await withTransaction(async (client) => {
      const serviceResult = await client.query(
        'SELECT id, provider_id FROM services WHERE id = $1 AND is_active = true',
        [serviceId]
      );
      const service = serviceResult.rows[0];
      if (!service) {
        const error = new Error('SERVICE_NOT_FOUND');
        error.status = 404;
        throw error;
      }

      const result = await client.query(
        `INSERT INTO reviews (service_id, customer_id, provider_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [serviceId, req.userId, service.provider_id, rating, comment]
      );

      await refreshAggregates(client, serviceId, service.provider_id);
      return result.rows[0].id;
    });

    const result = await query(`${reviewSelect} WHERE r.id = $1`, [reviewId]);
    res.status(201).json({
      success: true,
      message: '✅ Review added successfully',
      review: mapReview(result.rows[0])
    });
  } catch (error) {
    if (error.message === 'SERVICE_NOT_FOUND') {
      return res.status(404).json({ success: false, message: '❌ Service not found' });
    }
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: '❌ You have already reviewed this service' });
    }
    console.error('Add review error:', error.message);
    res.status(400).json({ success: false, message: '❌ Error adding review' });
  }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const result = await query(`${reviewSelect} WHERE r.service_id = $1 ORDER BY r.created_at DESC`, [req.params.serviceId]);
    res.status(200).json({ success: true, count: result.rowCount, reviews: result.rows.map(mapReview) });
  } catch (error) {
    console.error('Get service reviews error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching reviews' });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const result = await query(`${reviewSelect} WHERE r.provider_id = $1 ORDER BY r.created_at DESC`, [req.params.providerId]);
    res.status(200).json({ success: true, count: result.rowCount, reviews: result.rows.map(mapReview) });
  } catch (error) {
    console.error('Get provider reviews error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching reviews' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deleted = await withTransaction(async (client) => {
      const reviewResult = await client.query(
        'SELECT id, service_id, provider_id, customer_id FROM reviews WHERE id = $1 FOR UPDATE',
        [req.params.id]
      );
      const review = reviewResult.rows[0];
      if (!review) {
        const error = new Error('REVIEW_NOT_FOUND');
        error.status = 404;
        throw error;
      }
      if (review.customer_id !== req.userId) {
        const error = new Error('NOT_AUTHORIZED');
        error.status = 403;
        throw error;
      }

      await client.query('DELETE FROM reviews WHERE id = $1', [review.id]);
      await refreshAggregates(client, review.service_id, review.provider_id);
      return review;
    });

    res.status(200).json({ success: true, message: '✅ Review deleted successfully', reviewId: deleted.id });
  } catch (error) {
    if (error.message === 'REVIEW_NOT_FOUND') {
      return res.status(404).json({ success: false, message: '❌ Review not found' });
    }
    if (error.message === 'NOT_AUTHORIZED') {
      return res.status(403).json({ success: false, message: '❌ Not authorized to delete this review' });
    }
    console.error('Delete review error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error deleting review' });
  }
};
