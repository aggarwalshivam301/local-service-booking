# Local Service Booking: SQL Modernization Plan

## Objective

Replace MongoDB and Mongoose with PostgreSQL and direct parameterized SQL while preserving the existing Firebase identity-provider flow and HTTP response contracts. The user will review, merge, configure production secrets, and deploy the resulting branch.

## Target architecture

```text
React frontend
    │ Firebase ID token + JSON API requests
    ▼
Express API
    │ auth middleware resolves firebase_uid to a SQL user
    ├── PostgreSQL connection pool (`pg`)
    ├── SQL migrations (`backend/db/migrations`)
    └── Transactional service, booking, and review operations
```

Firebase remains responsible only for identity verification and optional storage features. PostgreSQL becomes the source of truth for application users, services, images, availability, bookings, and reviews.

## Relational schema

| Table | Purpose | Important constraints |
|---|---|---|
| `users` | Application profile linked to Firebase identity | Unique `firebase_uid` and `email`; role check; rating range check |
| `services` | Provider-owned service listings | Foreign key to `users`; category and price checks; active flag |
| `service_images` | Ordered service image URLs | Cascade delete from `services`; unique service/order pair |
| `service_availability` | Provider-defined date and time slots | Foreign key to `services`; time and date checks |
| `bookings` | Customer appointment requests | Foreign keys to service/provider/customer; status and role checks |
| `reviews` | One review per customer per service | Unique `(service_id, customer_id)`; rating range check |

Identifiers will be UUIDs generated in PostgreSQL. This avoids exposing sequential record counts and removes MongoDB ObjectId handling from the application. Monetary values will use `numeric(10,2)`, dates will use `date`, and appointment times will use PostgreSQL `time`.

## Business rules preserved and strengthened

The SQL implementation will preserve customer/provider authorization, Firebase-backed identity lookup, provider-owned service CRUD, booking lifecycle states, one-review-per-customer-per-service, and service/provider rating aggregates. Booking creation will execute inside a transaction and use a conflict-safe overlap query rather than only comparing identical start times. Review creation and deletion will update aggregate ratings in the same transaction.

The API will continue returning the existing `_id`-compatible identifier field and nested `providerId`, `serviceId`, `customerId` objects where the current frontend expects them. This reduces frontend breakage while the storage layer changes underneath.

## Migration and rollout safety

The branch will contain schema creation and seed scripts but will not connect to, rewrite, or delete any production database. Existing MongoDB data will not be implicitly migrated. A later, separately reviewed migration utility can export users, services, bookings, and reviews after field mapping and data-quality checks are approved.

The required production variables are `DATABASE_URL`, `FIREBASE_SERVICE_ACCOUNT_PATH`, `FIREBASE_STORAGE_BUCKET`, `FRONTEND_URL`, and `NODE_ENV`. The old `MONGODB_URI` variable and Mongoose dependency are removed from the application branch.

## Validation gates

The branch is complete only when the SQL migration applies to a clean PostgreSQL database, seed data can be inserted and removed safely, the health endpoint works without a database connection, backend tests cover the critical query and authorization paths, the frontend production build passes, and a repository scan finds no runtime MongoDB/Mongoose references.

## Deliberate non-goals

This branch will not force-push, rewrite Git history, rotate production credentials automatically, or claim a live deployment. Those actions remain under the user’s review and deployment control.
