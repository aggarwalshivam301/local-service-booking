const { body, validationResult } = require('express-validator');

// Validation rules
const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('displayName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('firebaseUid').trim().notEmpty().withMessage('Firebase UID is required'),
  body('role').isIn(['customer', 'provider']).withMessage('Role must be customer or provider')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('firebaseUid').trim().notEmpty().withMessage('Firebase UID is required')
];

const validateService = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes')
];

const validateBooking = [
  body('serviceId').trim().notEmpty().withMessage('Service ID is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Start time must be HH:MM format'),
  body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('End time must be HH:MM format')
];

const validateReview = [
  body('serviceId').trim().notEmpty().withMessage('Service ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters')
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '❌ Validation errors',
      errors: errors.array().map(e => ({
        field: e.param,
        message: e.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateService,
  validateBooking,
  validateReview,
  validate
};
