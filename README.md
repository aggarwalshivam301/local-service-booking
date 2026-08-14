# Local Service Booking

> A two-sided MERN platform for discovering local services, checking availability, and managing appointments.

Local Service Booking connects customers with local service providers. Customers can browse and filter services, review provider information, and request appointments. Providers can manage listings, availability, booking requests, and reviews.

## Project status

The repository contains an implemented MVP. The automated backend smoke test covers the health endpoint, and the frontend production build has been verified locally. A public demo is not configured in this repository yet.

| Capability | Status |
|---|---|
| Customer service discovery | Implemented |
| Provider listings | Implemented |
| Role-based booking flows | Implemented |
| Firebase authentication | Requires Firebase project configuration |
| MongoDB persistence | Requires local or hosted MongoDB |
| Automated end-to-end coverage | Planned |
| Public deployment | Not configured in this repository |

## Core features

- Browse services by category and search criteria.
- View provider and service details.
- Manage provider listings and availability.
- Request, confirm, cancel, and track bookings.
- Support customer reviews and ratings.
- Use Firebase Admin verification for protected backend routes.
- Render a responsive React interface for desktop and mobile screens.

## Architecture

```text
React frontend
    │ Axios + Firebase client authentication
    ▼
Express API
    │ auth middleware, validation, controllers
    ├── MongoDB via Mongoose
    └── Firebase Admin / Firestore / Storage (optional features)
```

## Technology stack

- **Frontend:** React 18, React Router, Axios, React Calendar, React Toastify, React Icons
- **Backend:** Node.js, Express, Mongoose, Express Validator
- **Authentication and storage:** Firebase client SDK and Firebase Admin SDK
- **Database:** MongoDB
- **Testing:** Node’s built-in test runner for backend smoke tests

## Repository structure

```text
backend/
  config/          Database and Firebase configuration
  controllers/     Auth, services, bookings, and reviews
  middleware/      Authentication and error handling
  models/          Mongoose schemas
  routes/          Express route definitions
  test/            Backend smoke tests
  server.js        API entrypoint
frontend/
  src/             React application
  package.json     Frontend scripts and dependencies
```

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, local or hosted
- A Firebase project if authentication or Firebase-backed features are enabled

### Backend

```bash
git clone https://github.com/aggarwalshivam301/local-service-booking.git
cd local-service-booking/backend
npm install
cp .env.example .env
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
npm start
```

The development frontend runs on `http://localhost:3000` by default.

## Configuration

Copy `backend/.env.example` to `backend/.env` and provide real values locally. The Firebase service-account JSON must live outside the repository and must never be committed. In production, configure `FIREBASE_SERVICE_ACCOUNT_PATH`, `FIREBASE_STORAGE_BUCKET`, `MONGODB_URI`, `FRONTEND_URL`, and a strong `JWT_SECRET` through the hosting provider’s secret manager.

Copy `frontend/.env.example` to `frontend/.env` and configure the Firebase web values plus `REACT_APP_API_URL`. Never commit `.env` files or private keys.

## Testing and builds

```bash
# Backend smoke test
cd backend
npm test

# Frontend production build
cd ../frontend
npm run build
```

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Service health check |
| `POST` | `/api/auth/register` | Create an application user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/services` | Browse service listings |
| `GET` | `/api/services/:id` | Read a service |
| `POST` | `/api/bookings` | Create a booking request |
| `PUT` | `/api/bookings/:id/status` | Update booking status |
| `POST` | `/api/reviews` | Create a review |

Protected routes require a Firebase ID token in the `Authorization: Bearer <token>` header.

## Security notes

Credentials that appeared in earlier repository versions must be treated as compromised and rotated. This branch removes the committed Firebase service-account file and replaces credential-like examples with safe placeholders, but removing a file from the current branch does not erase it from Git history. Rewrite history only after confirming that all affected credentials have been revoked.

## Deployment

The frontend can be deployed as a static React build and the backend as a Node service. Configure the backend’s environment variables and Firebase credentials in the hosting provider’s secret manager, deploy the backend first, then set `REACT_APP_API_URL` to the backend URL before building the frontend. Add the deployed frontend domain to Firebase authorized domains and set `FRONTEND_URL` on the backend.

## License

MIT

## Contact

- GitHub: [@aggarwalshivam301](https://github.com/aggarwalshivam301)
- Email: [shivaggarwal272@gmail.com](mailto:shivaggarwal272@gmail.com)
