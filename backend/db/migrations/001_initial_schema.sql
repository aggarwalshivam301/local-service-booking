CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL UNIQUE,
  email text NOT NULL,
  display_name text NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 1 AND 120),
  phone_number text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'provider')),
  profile_image text NOT NULL DEFAULT 'https://via.placeholder.com/150',
  street text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  zip_code text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  business_description text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  total_reviews integer NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 3 AND 160),
  description text NOT NULL CHECK (char_length(trim(description)) BETWEEN 10 AND 5000),
  category text NOT NULL CHECK (category IN ('cleaning', 'plumbing', 'electrical', 'beauty', 'tutoring', 'repair', 'other')),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  price_type text NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly')),
  duration_minutes integer NOT NULL DEFAULT 60 CHECK (duration_minutes >= 15),
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  total_bookings integer NOT NULL DEFAULT 0 CHECK (total_bookings >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS services_provider_idx ON services (provider_id);
CREATE INDEX IF NOT EXISTS services_category_idx ON services (category);
CREATE INDEX IF NOT EXISTS services_city_idx ON services (lower(city));
CREATE INDEX IF NOT EXISTS services_active_created_idx ON services (is_active, created_at DESC);

CREATE TABLE IF NOT EXISTS service_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  UNIQUE (service_id, sort_order)
);

CREATE TABLE IF NOT EXISTS service_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  available_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS service_availability_lookup_idx
  ON service_availability (service_id, available_date, start_time);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  provider_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price numeric(10,2) NOT NULL CHECK (total_price >= 0),
  customer_notes text NOT NULL DEFAULT '',
  cancellation_reason text NOT NULL DEFAULT '',
  cancelled_by text CHECK (cancelled_by IN ('customer', 'provider') OR cancelled_by IS NULL),
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS bookings_service_date_idx ON bookings (service_id, booking_date, start_time);
CREATE INDEX IF NOT EXISTS bookings_customer_created_idx ON bookings (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_provider_created_idx ON bookings (provider_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL CHECK (char_length(trim(comment)) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (service_id, customer_id)
);

CREATE INDEX IF NOT EXISTS reviews_service_created_idx ON reviews (service_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_provider_created_idx ON reviews (provider_id, created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS services_set_updated_at ON services;
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS bookings_set_updated_at ON bookings;
CREATE TRIGGER bookings_set_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS reviews_set_updated_at ON reviews;
CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();
