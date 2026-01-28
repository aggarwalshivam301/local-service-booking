const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Get all services with filters
// @route   GET /api/services
exports.getAllServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, city } = req.query;

    let query = { isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const services = await Service.find(query)
      .populate('providerId', 'displayName businessName profileImage rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching services',
      error: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'displayName businessName email phoneNumber profileImage rating')
      .populate('reviews.customerId', 'displayName profileImage');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '❌ Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching service',
      error: error.message
    });
  }
};

// @desc    Create service
// @route   POST /api/services
exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, priceType, duration, images, location } = req.body;

    const service = await Service.create({
      providerId: req.userId,
      title,
      description,
      category,
      price,
      priceType,
      duration,
      images: images || ['https://via.placeholder.com/300'],
      location
    });

    res.status(201).json({
      success: true,
      message: '✅ Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error creating service',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '❌ Service not found'
      });
    }

    // Check if user is the provider
    if (service.providerId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '❌ Not authorized to update this service'
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: '✅ Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error updating service',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '❌ Service not found'
      });
    }

    if (service.providerId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '❌ Not authorized to delete this service'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: '✅ Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error deleting service',
      error: error.message
    });
  }
};

// @desc    Get provider's services
// @route   GET /api/services/provider/my-services
exports.getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get provider services error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching your services',
      error: error.message
    });
  }
};
