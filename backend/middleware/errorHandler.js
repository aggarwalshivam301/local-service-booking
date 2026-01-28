// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

// Handle validation errors
const validationErrorHandler = (err, req, res, next) => {
  if (err.array) {
    const errors = err.array();
    return res.status(400).json({
      success: false,
      message: '❌ Validation errors',
      errors: errors.map(e => ({
        field: e.param,
        message: e.msg
      }))
    });
  }
  next(err);
};

module.exports = { errorHandler, validationErrorHandler };
