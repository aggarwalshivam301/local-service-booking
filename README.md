# local-service-booking
Local Service Booking Platform - MERN Stack
# 🏠 Local Service Booking Platform

> A full-stack web application connecting customers with local service providers for seamless appointment booking and service management.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

The Local Service Booking Platform is a modern web application designed to bridge the gap between service providers and customers. It enables:

- **For Customers**: Easy discovery of local services, real-time availability checking, instant booking, and booking management
- **For Service Providers**: Complete service listing management, availability control, booking management, and business analytics

Built with a focus on **real-time updates**, **conflict-free scheduling**, and **user experience**, this platform demonstrates modern full-stack development practices with React, Node.js, MongoDB, and Firebase.

### 🎯 Project Goals

- Create a production-ready booking platform
- Implement real-time features using Firebase Firestore
- Design scalable RESTful API architecture
- Build responsive, mobile-first UI
- Demonstrate secure authentication flows
- Showcase role-based access control

## ✨ Features

### 🔍 For Customers

- **Service Discovery**
  - Browse services by category (Home Repair, Cleaning, Plumbing, Beauty, Tutoring, etc.)
  - Advanced search with filters (price range, location, rating)
  - View detailed service information and provider profiles
  
- **Smart Booking System**
  - Real-time availability calendar
  - Time slot selection with conflict prevention
  - Instant booking confirmation
  - Booking status tracking (Pending → Confirmed → Completed)
  
- **Booking Management**
  - View all bookings with status filters
  - Cancel bookings with reasons
  - Booking history and analytics
  
- **Reviews & Ratings**
  - Rate completed services (1-5 stars)
  - Write detailed reviews
  - View aggregated ratings for services

### 💼 For Service Providers

- **Service Management**
  - Create unlimited service listings
  - Upload multiple service images
  - Set pricing (fixed or hourly rates)
  - Define service duration
  - Manage service categories
  
- **Availability Control**
  - Set working hours and days
  - Block specific dates/times
  - Automatic availability updates on bookings
  - Calendar view of all bookings
  
- **Business Dashboard**
  - View all booking requests
  - Accept or decline bookings
  - Track earnings and statistics
  - Manage customer reviews
  - Performance analytics

### 🔐 Security & Features

- **Authentication**
  - Firebase email/password authentication
  - JWT token-based API security
  - Password reset functionality
  - Session management
  
- **Real-time Updates**
  - Instant notification on booking status changes
  - Live availability updates
  - Real-time booking conflict prevention
  
- **Responsive Design**
  - Mobile-first approach
  - Works on all devices (desktop, tablet, mobile)
  - Touch-friendly interfaces
  - Progressive Web App capabilities

## 🎬 Demo

🔗 **Live Demo**: [https://your-app.vercel.app](https://your-app.vercel.app)

### Test Accounts

**Customer Account**
- Email: customer@example.com
- Password: Customer123!

**Provider Account**
- Email: provider@example.com
- Password: Provider123!

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.2 | UI Framework |
| React Router v6 | Client-side routing |
| Context API | State management |
| Axios | HTTP client |
| React Toastify | Notifications |
| date-fns | Date manipulation |
| React Calendar | Calendar component |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Primary database |
| Mongoose | MongoDB ODM |
| Firebase Admin SDK | Authentication & Storage |
| Express Validator | Input validation |
| Multer | File uploads |
| Cloudinary | Image storage |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud database |
| Firebase Firestore | Real-time updates |
| Firebase Storage | Image storage |
| Cloudinary | Image CDN |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| Git & GitHub | Version control |
| Postman | API testing |
| VS Code | Code editor |
| Render | Backend hosting |
| Vercel | Frontend hosting |

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ React Router │  │   Context    │  │  Firebase │ │
│  │    (SPA)     │  │     API      │  │   Auth    │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────┐
│                  API Layer (Express)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Auth    │  │ Services │  │    Bookings      │  │
│  │ Routes   │  │  Routes  │  │     Routes       │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │         Middleware (Auth, Validation)        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                  Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   MongoDB    │  │  Firestore   │  │ Firebase  │ │
│  │  (Primary)   │  │ (Real-time)  │  │  Storage  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Action** → React Component
2. **API Call** → Axios Request with JWT Token
3. **Middleware** → Authentication & Validation
4. **Controller** → Business Logic
5. **Model** → Database Operations
6. **Response** → JSON Data to Client
7. **UI Update** → React State & Component Re-render

## 📥 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas account) - [Setup Guide](https://www.mongodb.com/docs/manual/installation/)
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Create Account](https://firebase.google.com/)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/local-service-booking.git
cd local-service-booking
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Step 4: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter project name: `local-service-booking`
   - Follow setup wizard

2. **Enable Authentication**
   - Navigate to Authentication → Sign-in method
   - Enable "Email/Password"

3. **Create Firestore Database**
   - Navigate to Firestore Database
   - Create database in production mode
   - Choose your location

4. **Get Web Credentials**
   - Project Settings → General
   - Scroll to "Your apps"
   - Click web icon `</>`
   - Copy config values to `frontend/.env`

5. **Get Admin SDK Credentials**
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `backend/config/serviceAccountKey.json`

### Step 5: Database Setup

**Option A: MongoDB Atlas (Recommended)**

```bash
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Create database user
# 4. Whitelist IP (0.0.0.0/0 for development)
# 5. Get connection string
# 6. Add to backend/.env as MONGODB_URI
```

**Option B: Local MongoDB**

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
# Follow installation wizard
```

Update `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/local-service-booking
```

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/local-service-booking

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# JWT (Optional - for custom tokens)
JWT_SECRET=your_super_secret_key_min_32_characters

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdefgh
```

## 🚀 Usage

### Development Mode

**Terminal 1 - Start Backend**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

### Testing the Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   # Expected: {"message": "Server is running!"}
   ```

2. **Open Frontend**
   - Navigate to `http://localhost:3000`
   - Register a new account
   - Test authentication flow

3. **Database Verification**
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Use database
   use local-service-booking
   
   # Check collections
   show collections
   
   # View users
   db.users.find().pretty()
   ```

### Production Build

**Backend**
```bash
cd backend
npm start
```

**Frontend**
```bash
cd frontend
npm run build
# Build folder created with optimized production files
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-api.onrender.com/api
```

### Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints Overview

#### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/profile` | Get user profile | Private |
| PUT | `/auth/profile` | Update profile | Private |

#### Service Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/services` | Get all services | Public |
| GET | `/services/:id` | Get service by ID | Public |
| POST | `/services` | Create service | Provider |
| PUT | `/services/:id` | Update service | Provider |
| DELETE | `/services/:id` | Delete service | Provider |
| POST | `/services/:id/reviews` | Add review | Private |

#### Booking Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/bookings/my-bookings` | Get user bookings | Private |
| GET | `/bookings/:id` | Get booking by ID | Private |
| POST | `/bookings` | Create booking | Customer |
| PUT | `/bookings/:id/status` | Update status | Private |
| DELETE | `/bookings/:id` | Cancel booking | Private |

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "abc123xyz",
    "email": "john@example.com",
    "displayName": "John Doe",
    "role": "customer"
  }'
```

#### Create Service
```bash
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Professional House Cleaning",
    "description": "Deep cleaning service for your home",
    "category": "cleaning",
    "price": 75,
    "priceType": "fixed",
    "duration": 120,
    "location": {
      "city": "New York",
      "state": "NY"
    }
  }'
```

#### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "507f1f77bcf86cd799439011",
    "date": "2026-02-15",
    "startTime": "10:00",
    "endTime": "12:00",
    "customerNotes": "Please bring cleaning supplies"
  }'
```

### Response Format

**Success Response**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🗄️ Database Schema

### User Collection

```javascript
{
  "_id": ObjectId,
  "firebaseUid": String (unique),
  "email": String (unique),
  "displayName": String,
  "phoneNumber": String,
  "role": String (enum: ['customer', 'provider']),
  "profileImage": String,
  "address": {
    "street": String,
    "city": String,
    "state": String,
    "zipCode": String,
    "country": String
  },
  "businessName": String,
  "businessDescription": String,
  "rating": Number (default: 0),
  "totalReviews": Number (default: 0),
  "isVerified": Boolean (default: false),
  "createdAt": Date,
  "updatedAt": Date
}
```

### Service Collection

```javascript
{
  "_id": ObjectId,
  "providerId": ObjectId (ref: User),
  "title": String,
  "description": String,
  "category": String (enum),
  "price": Number,
  "priceType": String (enum: ['fixed', 'hourly']),
  "duration": Number (minutes),
  "images": [String],
  "availability": [{
    "date": Date,
    "startTime": String,
    "endTime": String,
    "isBooked": Boolean
  }],
  "location": {
    "address": String,
    "city": String,
    "state": String,
    "zipCode": String,
    "coordinates": {
      "lat": Number,
      "lng": Number
    }
  },
  "rating": Number,
  "reviews": [{
    "userId": ObjectId (ref: User),
    "rating": Number,
    "comment": String,
    "createdAt": Date
  }],
  "totalBookings": Number,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Booking Collection

```javascript
{
  "_id": ObjectId,
  "serviceId": ObjectId (ref: Service),
  "providerId": ObjectId (ref: User),
  "customerId": ObjectId (ref: User),
  "date": Date,
  "startTime": String,
  "endTime": String,
  "status": String (enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']),
  "totalPrice": Number,
  "customerNotes": String,
  "cancellationReason": String,
  "cancelledBy": String,
  "cancelledAt": Date,
  "completedAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

## 📸 Screenshots

### Home Page
*Clean, modern landing page with service categories*
![Home](screenshots/home.png)

### Service Browse
*Browse services with advanced filters*
![Services](screenshots/services.png)

### Service Detail
*Detailed service information with booking calendar*
![Service Detail](screenshots/service-detail.png)

### Booking Flow
*Simple, intuitive booking process*
![Booking](screenshots/booking.png)

### Dashboard
*Comprehensive dashboard for providers*
![Dashboard](screenshots/dashboard.png)

### My Bookings
*Manage all your bookings in one place*
![My Bookings](screenshots/my-bookings.png)

## 🚀 Deployment

### Backend Deployment (Render)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Visit [render.com](https://render.com)
   - New Web Service → Connect GitHub repo
   - Configure:
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
     - Add environment variables

3. **Note your backend URL**
   ```
   https://your-app-name.onrender.com
   ```

### Frontend Deployment (Vercel)

1. **Update API URL**
   ```env
   # frontend/.env.production
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

2. **Deploy on Vercel**
   ```bash
   npm install -g vercel
   cd frontend
   vercel --prod
   ```

3. **Configure**
   - Set root directory: `frontend`
   - Add environment variables
   - Deploy!

### Post-Deployment

1. **Update Firebase Authorized Domains**
   - Add your Vercel domain to Firebase Console

2. **Update CORS**
   - Add frontend URL to backend CORS config

3. **Test Production**
   - Register new user
   - Create service
   - Make booking
   - Verify all features work

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Protected routes redirect to login
- [ ] Profile updates work

**Services (Provider)**
- [ ] Create service
- [ ] Upload images
- [ ] Edit service
- [ ] Delete service
- [ ] Set availability

**Services (Customer)**
- [ ] Browse services
- [ ] Search services
- [ ] Filter by category
- [ ] View service details
- [ ] See provider info

**Bookings**
- [ ] Create booking
- [ ] View booking details
- [ ] Cancel booking
- [ ] Provider can accept/decline
- [ ] Real-time updates work
- [ ] Conflict prevention works

### API Testing with Postman

Import the Postman collection:
```bash
# Collection available in /postman folder
# Import into Postman for easy API testing
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards

- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Contact

**Your Name**
- Email: your.email@example.com
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)

**Project Links**
- Repository: [github.com/yourusername/local-service-booking](https://github.com/yourusername/local-service-booking)
- Live Demo: [your-app.vercel.app](https://your-app.vercel.app)
- API Docs: [your-app.vercel.app/docs](https://your-app.vercel.app/docs)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel](https://vercel.com/) for hosting
- [Render](https://render.com/) for backend hosting

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

---

**Built with ❤️ by [shiv aggarwal]**

*Last Updated: January 2026*
