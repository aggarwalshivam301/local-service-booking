const express = require('express');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, validate } = require('../utils/validators');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, validate, register);
router.post('/login', validateLogin, validate, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
