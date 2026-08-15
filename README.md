# Local Service Booking

> A two-sided React and Express platform for discovering local services, requesting appointments, and managing provider workflows.

Local Service Booking connects customers with local service providers. Customers can browse and filter services, review provider information, and request appointments. Providers can manage listings, respond to booking requests, and keep their profile current.

## Project status

This branch is the **SQL modernization branch**. MongoDB and Mongoose have been removed from the backend runtime and replaced with PostgreSQL, parameterized queries, relational constraints, and transactional booking/review operations. The frontend now includes service details, booking requests, booking management, profile editing, and a provider service workspace.

| Capability | Status |
|---|---|
| Customer service discovery | Implemented |
| Provider listings and workspace | Implemented |
| Service detail and booking request flow | Implemented |
| Customer/provider booking management | Implemented |
| Firebase identity verification | Requires Firebase project configuration |
| PostgreSQL persistence | Implemented with migrations and seed data |
| Automated SQL schema verification | Implemented |
| Public deployment | User-controlled handoff; not performed by this branch |

## Architecture

```text
React frontend
    │ Axios + Firebase ID token
    ▼
Express API
    │ auth middleware, validation, controllers
    ├── PostgreSQL via `pg` connection pool
    ├── SQL migrations and development seed data
    └── Firebase Admin verification and optional storage
```

Firebase remains the identity provider. PostgreSQL is the source of truth for application users, services, service images, availability, bookings, and reviews.

## Technology stack

- **Frontend:** React 18, React Router, Axios, React Calendar, React Toastify, React Icons
- **Backend:** Node.js, Express, PostgreSQL, `pg`, Express Validator
- **Authentication and storage:** Firebase client SDK and Firebase Admin SDK
- **Database:** PostgreSQL 16 or newer
- **Testing:** Node’s built-in test runner, SQL migration checks, and production frontend builds

## Repository structure

```text
backend/
  config/          Firebase configuration
  controllers/     SQL-backed auth, services, bookings, and reviews
  db/              PostgreSQL pool, migrations, seed, checks, and mappers
  middleware/      Firebase authentication and role authorization
  routes/          Express route definitions
  test/            Backend and SQL schema smoke tests
  server.js        API entrypoint
frontend/
  src/
    components/    Navigation and protected-route components
    context/       Firebase-backed application auth context
    pages/         Home, services, details, bookings, profile, and provider workspace
    services/      Axios and Firebase clients
```

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL 14 or newer
- A Firebase project if authentication or Firebase-backed features are enabled

### Backend

```bash
git clone https://github.com/aggarwalshivam301/local-service-booking.git
cd local-service-booking/backend
npm install
cp .env.example .env
# Edit DATABASE_URL and Firebase variables in .env
npm run db:migrate
npm run db:seed
npm run dev
```

The API runs on `http://localhost:5000` by default. Check it with:

```bash
curl http://localhost:5000/health
```

### Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL and REACT_APP_FIREBASE_* values
npm start
```

The development frontend runs on `http://localhost:3000` by default.

## PostgreSQL configuration

Copy `backend/.env.example` to `backend/.env` and provide a PostgreSQL connection string such as:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/local_service_booking
DB_POOL_MAX=10
```

Apply the schema and optional local seed data with:

```bash
npm run db:migrate
npm run db:seed
npm run db:check
```

The migration is idempotent and creates the following tables: `users`, `services`, `service_images`, `service_availability`, `bookings`, and `reviews`. It does not connect to or modify any production database.

Firebase service-account JSON must live outside the repository and must never be committed. In production, configure `DATABASE_URL`, `FIREBASE_SERVICE_ACCOUNT_PATH`, `FIREBASE_STORAGE_BUCKET`, `FRONTEND_URL`, and a strong `JWT_SECRET` through the hosting provider’s secret manager.

## Testing and builds

```bash
# Backend smoke and SQL integration tests
cd backend
npm test

# Frontend production build
cd ../frontend
npm run build
```

When `DATABASE_URL` is present, the test suite verifies that the six relational tables exist. CI provisions PostgreSQL, applies migrations, runs the backend tests, and builds the frontend.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Service health check |
| `POST` | `/api/auth/register` | Create an application user |
| `POST` | `/api/auth/login` | Resolve Firebase identity to an application user |
| `GET` | `/api/auth/profile` | Read the current profile |
| `PUT` | `/api/auth/profile` | Update the current profile |
| `GET` | `/api/services` | Browse services with search and filters |
| `GET` | `/api/services/:id` | Read a service and its related data |
| `POST` | `/api/services` | Create a provider listing |
| `GET` | `/api/services/provider/my-services` | List the provider’s own services |
| `POST` | `/api/bookings` | Create an overlap-checked booking request |
| `GET` | `/api/bookings/my-bookings` | Read customer/provider bookings |
| `PUT` | `/api/bookings/:id/status` | Confirm or complete a booking |
| `DELETE` | `/api/bookings/:id` | Cancel a pending or confirmed booking |
| `POST` | `/api/reviews` | Create a unique service review |

Protected routes require a Firebase ID token in the `Authorization: Bearer <token>` header.

## Migration notes

The migration replaces MongoDB ObjectIds with PostgreSQL UUIDs. The API serializers continue exposing `_id` and nested `providerId`, `serviceId`, `customerId`, and `images` fields so the existing frontend contract remains compatible. Booking creation uses a transaction plus a PostgreSQL advisory lock to reject overlapping active bookings for the same service and date. Review creation and deletion recalculate service and provider aggregates transactionally.

No production data is migrated automatically. If existing MongoDB data must be retained, create a separately reviewed export/import process with field mapping, validation, duplicate handling, and a rollback plan before running it against production.

## Security notes

Credentials that appeared in earlier repository versions must be treated as compromised and rotated. This branch removes the committed Firebase service-account file, removes the MongoDB runtime, and replaces credential-like examples with safe placeholders, but removing a file from the current branch does not erase it from Git history. Rewrite history only after all affected credentials have been revoked.

## Deployment handoff

Deploy PostgreSQL first, then the backend Node service with `DATABASE_URL`, Firebase Admin credentials, `FRONTEND_URL`, and `NODE_ENV=production`. Verify `/health`, apply `npm run db:migrate`, and confirm authentication plus booking workflows. Deploy the frontend as a static React application with `REACT_APP_API_URL` pointing to the backend. Add the frontend domain to Firebase authorized domains and keep the backend CORS origin restricted to the deployed frontend URL.

## License

MIT

## Contact

- GitHub: [@aggarwalshivam301](https://github.com/aggarwalshivam301)
- Email: [shivaggarwal272@gmail.com](mailto:shivaggarwal272@gmail.com)
