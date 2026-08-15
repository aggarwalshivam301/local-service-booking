const { withTransaction, closeDatabase } = require('./index');

const main = async () => {
  await withTransaction(async (client) => {
    const providerResult = await client.query(
      `INSERT INTO users (firebase_uid, email, display_name, role, business_name, business_description, city, state, is_verified)
       VALUES ($1, $2, $3, 'provider', $4, $5, $6, $7, true)
       ON CONFLICT (firebase_uid) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         role = EXCLUDED.role,
         business_name = EXCLUDED.business_name,
         business_description = EXCLUDED.business_description,
         city = EXCLUDED.city,
         state = EXCLUDED.state,
         is_verified = EXCLUDED.is_verified
       RETURNING id`,
      [
        'seed-provider-local-service-booking',
        'provider@example.test',
        'Demo Provider',
        'Neighbourhood Repairs',
        'General home maintenance and repair services.',
        'New Delhi',
        'Delhi'
      ]
    );

    await client.query(
      `INSERT INTO users (firebase_uid, email, display_name, role, city, state)
       VALUES ($1, $2, $3, 'customer', $4, $5)
       ON CONFLICT (firebase_uid) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         role = EXCLUDED.role,
         city = EXCLUDED.city,
         state = EXCLUDED.state`,
      [
        'seed-customer-local-service-booking',
        'customer@example.test',
        'Demo Customer',
        'New Delhi',
        'Delhi'
      ]
    );

    const providerId = providerResult.rows[0].id;
    const existingService = await client.query(
      'SELECT id FROM services WHERE provider_id = $1 AND title = $2 LIMIT 1',
      [providerId, 'Home repair consultation']
    );
    const serviceResult = existingService.rowCount > 0
      ? existingService
      : await client.query(
        `INSERT INTO services (provider_id, title, description, category, price, price_type, duration_minutes, city, state)
         VALUES ($1, $2, $3, 'repair', $4, 'fixed', $5, $6, $7)
         RETURNING id`,
        [
          providerId,
          'Home repair consultation',
          'A practical consultation for small household repairs and maintenance planning.',
          35,
          60,
          'New Delhi',
          'Delhi'
        ]
      );

    if (serviceResult.rowCount > 0) {
      const serviceId = serviceResult.rows[0].id;
      await client.query(
        `INSERT INTO service_images (service_id, image_url, sort_order)
         VALUES ($1, $2, 0)
         ON CONFLICT (service_id, sort_order) DO NOTHING`,
        [serviceId, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952']
      );
    }
  });

  console.log('Development seed completed');
};

main()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
