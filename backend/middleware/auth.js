const { admin } = require('../config/firebase');
const { query } = require('../db');

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
    if (!admin.apps.length) {
      return res.status(503).json({
        success: false,
        message: 'Authentication service is not configured'
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    // Resolve the Firebase identity to the SQL application user.
    const result = await query('SELECT id, role FROM users WHERE firebase_uid = $1', [decoded.uid]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ User not found'
      });
    }

    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: '❌ Token verification failed'
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
