const admin = require('../config/firebase');
const User = require('../models/User');

// Protect routes - Verify Firebase Token
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '❌ No token, authorization denied'
      });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    // Get user from database
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ User not found'
      });
    }

    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: '❌ Token verification failed',
      error: error.message
    });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: '❌ Not authorized to access this resource'
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
