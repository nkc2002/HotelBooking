const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all reviews (admin)
// @route   GET /api/v1/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const reviews = await Review.find()
    .populate('userId', 'name')
    .populate('hotelId', 'name')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Get all reviews for a hotel
// @route   GET /api/v1/reviews/hotel/:hotelId
// @access  Public
const getHotelReviews = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ hotelId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ hotelId }),
  ]);

  const avgResult = await Review.aggregate([
    { $match: { hotelId: require('mongoose').Types.ObjectId.createFromHexString(hotelId) } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);
  const averageRating = avgResult.length > 0 ? Math.round(avgResult[0].avg * 10) / 10 : 0;

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    averageRating,
    page,
    pages: Math.ceil(total / limit),
    data: reviews,
  });
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('userId', 'name')
    .populate('hotelId', 'name');

  if (!review) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { hotelId, bookingId, rating, comment } = req.body;

  if (!bookingId) {
    return res.status(400).json({ success: false, error: 'Please provide booking ID' });
  }

  // Verify hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ success: false, error: 'Hotel not found' });
  }

  // Verify booking exists, belongs to user, belongs to hotel, and is completed
  const booking = await Booking.findOne({
    _id: bookingId,
    userId: req.user.userId,
    hotelId,
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found or does not belong to you',
    });
  }

  if (booking.status !== 'completed') {
    return res.status(400).json({
      success: false,
      error: 'You can only review completed bookings',
    });
  }

  // Check if this booking has already been reviewed
  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    return res.status(400).json({
      success: false,
      error: 'You have already reviewed this booking',
    });
  }

  const review = await Review.create({
    userId: req.user.userId,
    hotelId,
    bookingId,
    rating,
    comment,
  });

  const populatedReview = await Review.findById(review._id).populate('userId', 'name');

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: populatedReview,
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  if (review.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Not authorized to update this review' });
  }

  const { rating, comment } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();

  const populatedReview = await Review.findById(review._id).populate('userId', 'name');

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: populatedReview,
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  if (review.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Not authorized to delete this review' });
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Review deleted successfully', data: {} });
});

// @desc    Get user's reviews
// @route   GET /api/v1/reviews/user/:userId
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Not authorized to view these reviews' });
  }

  const reviews = await Review.find({ userId })
    .populate('hotelId', 'name images')
    .populate('bookingId', 'checkInDate checkOutDate')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Get completed bookings eligible for review for a hotel
// @route   GET /api/v1/reviews/eligible/:hotelId
// @access  Private
const getEligibleBookings = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  // Get all completed bookings for this user at this hotel
  const completedBookings = await Booking.find({
    userId: req.user.userId,
    hotelId,
    status: 'completed',
  }).select('_id checkInDate checkOutDate roomId').populate('roomId', 'title');

  if (completedBookings.length === 0) {
    return res.status(200).json({ success: true, data: [], hasEligible: false });
  }

  // Find which bookings already have reviews
  const bookingIds = completedBookings.map((b) => b._id);
  const reviewedBookingIds = await Review.find({ bookingId: { $in: bookingIds } })
    .select('bookingId')
    .then((reviews) => reviews.map((r) => r.bookingId.toString()));

  const eligible = completedBookings.filter(
    (b) => !reviewedBookingIds.includes(b._id.toString())
  );

  res.status(200).json({
    success: true,
    data: eligible,
    hasEligible: eligible.length > 0,
  });
});

module.exports = {
  getAllReviews,
  getHotelReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getEligibleBookings,
};
