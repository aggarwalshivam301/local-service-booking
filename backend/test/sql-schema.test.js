const test = require('node:test');
const assert = require('node:assert/strict');

const hasDatabase = Boolean(process.env.DATABASE_URL);

test('PostgreSQL schema is available when DATABASE_URL is configured', { skip: !hasDatabase }, async (t) => {
  const { query, closeDatabase } = require('../db');
  t.after(() => closeDatabase());

  const result = await query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('users', 'services', 'service_images', 'service_availability', 'bookings', 'reviews')
    ORDER BY table_name
  `);

  assert.deepEqual(result.rows.map((row) => row.table_name), [
    'bookings',
    'reviews',
    'service_availability',
    'service_images',
    'services',
    'users'
  ]);
});
