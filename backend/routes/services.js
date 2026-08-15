const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validateService, validate } = require('../utils/validators');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getProviderServices
} = require('../controllers/serviceController');

const router = express.Router();

// Public routes
router.get('/', getAllServices);

// Provider-specific path must be declared before the dynamic `/:id` route.
router.get('/provider/my-services', protect, authorize('provider'), getProviderServices);
router.get('/:id', getService);

// Protected routes (Provider only)
router.post('/', protect, authorize('provider'), validateService, validate, createService);
router.put('/:id', protect, authorize('provider'), updateService);
router.delete('/:id', protect, authorize('provider'), deleteService);


module.exports = router;
