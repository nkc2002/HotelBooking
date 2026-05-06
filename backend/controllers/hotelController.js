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

  const hotelIds = hotels.map((h) => h._id);
  const reviewStats = hotelIds.length
    ? await Review.aggregate([
        { $match: { hotelId: { $in: hotelIds } } },
        {
          $group: {
            _id: "$hotelId",
            averageRating: { $avg: "$rating" },
            numReviews: { $sum: 1 },
          },
        },
      ])
    : [];

  const roomPriceStats = hotelIds.length
    ? await Room.aggregate([
        { $match: { hotelId: { $in: hotelIds } } },
        {
          $group: {
            _id: "$hotelId",
            minRoomPrice: { $min: "$price" },
          },
        },
      ])
    : [];

  const statsMap = new Map(
    reviewStats.map((s) => [
      s._id.toString(),
      {
        averageRating: Math.round((s.averageRating || 0) * 10) / 10,
        numReviews: s.numReviews || 0,
      },
    ])
  );

  const roomPriceMap = new Map(
    roomPriceStats.map((s) => [s._id.toString(), s.minRoomPrice])
  );

  const hotelsWithStats = hotels.map((hotel) => {
    const stats = statsMap.get(hotel._id.toString()) || { averageRating: 0, numReviews: 0 };
    const minRoomPrice = roomPriceMap.get(hotel._id.toString());
    const obj = hotel.toObject();
    return {
      ...obj,
      averageRating: stats.averageRating,
      numReviews: stats.numReviews,
      minRoomPrice: typeof minRoomPrice === "number" ? minRoomPrice : null,
    };
  });

  const total = await Hotel.countDocuments(query);

  res.status(200).json({
    success: true,
    count: hotelsWithStats.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: hotelsWithStats,
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

  const [stats] = await Review.aggregate([
    {
      $match: {
        hotelId: hotel._id,
      },
    },
    {
      $group: {
        _id: "$hotelId",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...hotel.toObject(),
      averageRating: Math.round((stats?.averageRating || 0) * 10) / 10,
      numReviews: stats?.numReviews || 0,
    },
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
