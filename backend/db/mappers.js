const numberOrNull = (value) => (value === null || value === undefined ? value : Number(value));

const mapUser = (user) => {
  if (!user) return null;
  return {
    _id: user.id,
    id: user.id,
    firebaseUid: user.firebase_uid,
    email: user.email,
    displayName: user.display_name,
    phoneNumber: user.phone_number,
    role: user.role,
    profileImage: user.profile_image,
    address: {
      street: user.street || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zip_code || ''
    },
    businessName: user.business_name || '',
    businessDescription: user.business_description || '',
    rating: numberOrNull(user.rating),
    totalReviews: user.total_reviews || 0,
    isVerified: Boolean(user.is_verified),
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
};

const mapService = (row) => ({
  _id: row.service_id,
  id: row.service_id,
  providerId: row.provider || row.provider_id,
  title: row.title,
  description: row.description,
  category: row.category,
  price: numberOrNull(row.price),
  priceType: row.price_type,
  duration: row.duration_minutes,
  images: row.images || [],
  location: {
    city: row.city || '',
    state: row.state || '',
    address: row.address || ''
  },
  availability: row.availability || [],
  reviews: row.reviews || [],
  rating: numberOrNull(row.rating),
  totalBookings: row.total_bookings || 0,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapBooking = (row) => ({
  _id: row.booking_id,
  id: row.booking_id,
  serviceId: row.service || row.service_id,
  providerId: row.provider || row.provider_id,
  customerId: row.customer || row.customer_id,
  date: row.booking_date,
  startTime: row.start_time,
  endTime: row.end_time,
  status: row.status,
  totalPrice: numberOrNull(row.total_price),
  customerNotes: row.customer_notes || '',
  cancellationReason: row.cancellation_reason || '',
  cancelledBy: row.cancelled_by,
  cancelledAt: row.cancelled_at,
  completedAt: row.completed_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapReview = (row) => ({
  _id: row.review_id,
  id: row.review_id,
  serviceId: row.service_id,
  customerId: row.customer || row.customer_id,
  providerId: row.provider_id,
  rating: row.rating,
  comment: row.comment,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = { mapUser, mapService, mapBooking, mapReview };
