const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '❌ User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      firebaseUid,
      email,
      displayName,
      role: role || 'customer'
    });

    res.status(201).json({
      success: true,
      message: '✅ User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user (verify Firebase token)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { firebaseUid, email } = req.body;

    // Find user
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '❌ User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: '✅ Login successful',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error logging in',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, phoneNumber, businessName, businessDescription, address, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        displayName,
        phoneNumber,
        businessName,
        businessDescription,
        address,
        profileImage
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: '✅ Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: '❌ Error updating profile',
      error: error.message
    });
  }
};
