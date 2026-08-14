const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local-service-booking');
    console.log('✅ MongoDB connected successfully');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exitCode = 1;
  }
};

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Server is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
