const { query } = require('../db');

const toUser = (row) => ({
  _id: row.id,
  id: row.id,
  firebaseUid: row.firebase_uid,
  email: row.email,
  displayName: row.display_name,
  phoneNumber: row.phone_number,
  role: row.role,
  profileImage: row.profile_image,
  address: {
    street: row.street,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code
  },
  businessName: row.business_name,
  businessDescription: row.business_description,
  rating: Number(row.rating),
  totalReviews: row.total_reviews,
  isVerified: row.is_verified,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const findById = async (id) => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

exports.register = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, role = 'customer' } = req.body;

    const existingUser = await query(
      'SELECT id FROM users WHERE firebase_uid = $1 OR lower(email) = lower($2) LIMIT 1',
      [firebaseUid, email]
    );

    if (existingUser.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: '❌ User with this email or Firebase account already exists'
      });
    }

    const result = await query(
      `INSERT INTO users (firebase_uid, email, display_name, role)
       VALUES ($1, lower($2), $3, $4)
       RETURNING *`,
      [firebaseUid, email, displayName, role]
    );

    res.status(201).json({
      success: true,
      message: '✅ User registered successfully',
      user: toUser(result.rows[0])
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(error.code === '23505' ? 400 : 500).json({
      success: false,
      message: error.code === '23505' ? '❌ User already exists' : '❌ Error registering user'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { firebaseUid } = req.body;
    const result = await query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: '❌ User not found' });
    }

    res.status(200).json({
      success: true,
      message: '✅ Login successful',
      user: toUser(result.rows[0])
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error logging in' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const row = await findById(req.userId);
    if (!row) {
      return res.status(404).json({ success: false, message: '❌ User not found' });
    }

    res.status(200).json({ success: true, user: toUser(row) });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      displayName,
      phoneNumber,
      businessName,
      businessDescription,
      address = {},
      profileImage
    } = req.body;

    const result = await query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           phone_number = COALESCE($2, phone_number),
           business_name = COALESCE($3, business_name),
           business_description = COALESCE($4, business_description),
           street = COALESCE($5, street),
           city = COALESCE($6, city),
           state = COALESCE($7, state),
           zip_code = COALESCE($8, zip_code),
           profile_image = COALESCE($9, profile_image)
       WHERE id = $10
       RETURNING *`,
      [
        displayName,
        phoneNumber,
        businessName,
        businessDescription,
        address.street,
        address.city,
        address.state,
        address.zipCode,
        profileImage,
        req.userId
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: '❌ User not found' });
    }

    res.status(200).json({
      success: true,
      message: '✅ Profile updated successfully',
      user: toUser(result.rows[0])
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, message: '❌ Error updating profile' });
  }
};

exports.toUser = toUser;
exports.findById = findById;
