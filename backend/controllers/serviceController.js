const { query, withTransaction } = require('../db');
const { mapService } = require('../db/mappers');

const serviceSelect = `
  SELECT
    s.id AS service_id,
    s.provider_id,
    s.title,
    s.description,
    s.category,
    s.price,
    s.price_type,
    s.duration_minutes,
    s.city,
    s.state,
    s.address,
    s.rating,
    s.total_bookings,
    s.is_active,
    s.created_at,
    s.updated_at,
    json_build_object(
      '_id', u.id,
      'id', u.id,
      'displayName', u.display_name,
      'businessName', u.business_name,
      'email', u.email,
      'phoneNumber', u.phone_number,
      'profileImage', u.profile_image,
      'rating', u.rating,
      'isVerified', u.is_verified
    ) AS provider,
    COALESCE((
      SELECT json_agg(si.image_url ORDER BY si.sort_order)
      FROM service_images si
      WHERE si.service_id = s.id
    ), '[]'::json) AS images,
    COALESCE((
      SELECT json_agg(
        json_build_object(
          '_id', sa.id,
          'date', sa.available_date,
          'startTime', sa.start_time,
          'endTime', sa.end_time,
          'isBooked', sa.is_booked
        ) ORDER BY sa.available_date, sa.start_time
      )
      FROM service_availability sa
      WHERE sa.service_id = s.id
    ), '[]'::json) AS availability,
    COALESCE((
      SELECT json_agg(
        json_build_object(
          '_id', r.id,
          'rating', r.rating,
          'comment', r.comment,
          'createdAt', r.created_at,
          'customerId', json_build_object(
            '_id', c.id,
            'displayName', c.display_name,
            'profileImage', c.profile_image
          )
        ) ORDER BY r.created_at DESC
      )
      FROM reviews r
      JOIN users c ON c.id = r.customer_id
      WHERE r.service_id = s.id
    ), '[]'::json) AS reviews
  FROM services s
  JOIN users u ON u.id = s.provider_id
`;

const getServiceRow = async (serviceId, includeInactive = false) => {
  const result = await query(
    `${serviceSelect} WHERE s.id = $1 ${includeInactive ? '' : 'AND s.is_active = true'}`,
    [serviceId]
  );
  return result.rows[0] || null;
};

const insertImages = async (client, serviceId, images) => {
  for (const [sortOrder, imageUrl] of images.entries()) {
    if (typeof imageUrl !== 'string' || imageUrl.trim() === '') continue;
    await client.query(
      `INSERT INTO service_images (service_id, image_url, sort_order)
       VALUES ($1, $2, $3)`,
      [serviceId, imageUrl.trim(), sortOrder]
    );
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, city } = req.query;
    const values = [];
    const conditions = ['s.is_active = true'];

    const add = (value) => {
      values.push(value);
      return `$${values.length}`;
    };

    if (category) conditions.push(`s.category = ${add(category)}`);
    if (city) conditions.push(`s.city ILIKE '%' || ${add(city)} || '%'`);
    if (minPrice) conditions.push(`s.price >= ${add(Number(minPrice))}`);
    if (maxPrice) conditions.push(`s.price <= ${add(Number(maxPrice))}`);
    if (search) {
      const searchParam = add(search);
      conditions.push(`(s.title ILIKE '%' || ${searchParam} || '%' OR s.description ILIKE '%' || ${searchParam} || '%')`);
    }

    const result = await query(
      `${serviceSelect} WHERE ${conditions.join(' AND ')} ORDER BY s.created_at DESC`,
      values
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      services: result.rows.map(mapService)
    });
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching services' });
  }
};

exports.getService = async (req, res) => {
  try {
    const row = await getServiceRow(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: '❌ Service not found' });
    res.status(200).json({ success: true, service: mapService(row) });
  } catch (error) {
    console.error('Get service error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching service' });
  }
};

exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      priceType = 'fixed',
      duration = 60,
      images = [],
      location = {}
    } = req.body;

    const row = await withTransaction(async (client) => {
      const result = await client.query(
        `INSERT INTO services
          (provider_id, title, description, category, price, price_type, duration_minutes, city, state, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          req.userId,
          title,
          description,
          category,
          price,
          priceType,
          duration,
          location.city || '',
          location.state || '',
          location.address || ''
        ]
      );
      const serviceId = result.rows[0].id;
      await insertImages(client, serviceId, images.length ? images : ['https://via.placeholder.com/300']);
      return serviceId;
    });

    const created = await getServiceRow(row);
    res.status(201).json({ success: true, message: '✅ Service created successfully', service: mapService(created) });
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(400).json({ success: false, message: '❌ Error creating service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const current = await getServiceRow(req.params.id, true);
    if (!current) return res.status(404).json({ success: false, message: '❌ Service not found' });
    if (current.provider_id !== req.userId) {
      return res.status(403).json({ success: false, message: '❌ Not authorized to update this service' });
    }

    const { location = {}, images, ...fields } = req.body;
    await withTransaction(async (client) => {
      await client.query(
        `UPDATE services
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             price = COALESCE($4, price),
             price_type = COALESCE($5, price_type),
             duration_minutes = COALESCE($6, duration_minutes),
             city = COALESCE($7, city),
             state = COALESCE($8, state),
             address = COALESCE($9, address),
             is_active = COALESCE($10, is_active)
         WHERE id = $11 AND provider_id = $12`,
        [
          fields.title,
          fields.description,
          fields.category,
          fields.price,
          fields.priceType,
          fields.duration,
          location.city,
          location.state,
          location.address,
          fields.isActive,
          req.params.id,
          req.userId
        ]
      );

      if (Array.isArray(images)) {
        await client.query('DELETE FROM service_images WHERE service_id = $1', [req.params.id]);
        await insertImages(client, req.params.id, images);
      }
    });

    const updated = await getServiceRow(req.params.id, true);
    res.status(200).json({ success: true, message: '✅ Service updated successfully', service: mapService(updated) });
  } catch (error) {
    console.error('Update service error:', error.message);
    res.status(400).json({ success: false, message: '❌ Error updating service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const result = await query(
      `UPDATE services SET is_active = false
       WHERE id = $1 AND provider_id = $2 AND is_active = true
       RETURNING id`,
      [req.params.id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: '❌ Service not found or already inactive' });
    }

    res.status(200).json({ success: true, message: '✅ Service archived successfully' });
  } catch (error) {
    console.error('Delete service error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error deleting service' });
  }
};

exports.getProviderServices = async (req, res) => {
  try {
    const result = await query(
      `${serviceSelect} WHERE s.provider_id = $1 ORDER BY s.created_at DESC`,
      [req.userId]
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      services: result.rows.map(mapService)
    });
  } catch (error) {
    console.error('Get provider services error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching your services' });
  }
};
