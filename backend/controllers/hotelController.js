const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = asyncHandler(async (req, res) => {
  const { city, minRating, maxRating, limit = 10, page = 1 } = req.query;

  // Build query
  const query = {};

  if (city) {
    query.city = { $regex: city, $options: "i" };
  }

  if (minRating || maxRating) {
    query.rating = {};
    if (minRating) query.rating.$gte = Number(minRating);
    if (maxRating) query.rating.$lte = Number(maxRating);
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const hotels = await Hotel.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Hotel.countDocuments(query);

  res.status(200).json({
    success: true,
    count: hotels.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: hotels,
  });
});

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      error: "Hotel not found",
    });
  }

  res.status(200).json({
    success: true,
    data: hotel,
  });
});

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body);

  res.status(201).json({
    success: true,
    message: "Hotel created successfully",
    data: hotel,
  });
});

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!hotel) {
    return res.status(404).json({
      success: false,
      error: "Hotel not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Hotel updated successfully",
    data: hotel,
  });
});

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      error: "Hotel not found",
    });
  }

  // Delete all rooms associated with this hotel
  await Room.deleteMany({ hotelId: req.params.id });

  // Delete all bookings associated with this hotel
  await Booking.deleteMany({ hotelId: req.params.id });

  // Delete all reviews and recalculate (or just delete)
  await Review.deleteMany({ hotelId: req.params.id });

  await hotel.deleteOne();

  res.status(200).json({
    success: true,
    message: "Hotel and all associated data deleted successfully",
    data: {},
  });
});

// @desc    Get hotel rooms
// @route   GET /api/hotels/:id/rooms
// @access  Public
const getHotelRooms = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      error: "Hotel not found",
    });
  }

  const rooms = await Room.find({ hotelId: req.params.id });

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelRooms,
};
