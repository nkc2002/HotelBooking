const { hotelAmenities, roomAmenities } = require('../utils/amenities');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all hotel amenities
// @route   GET /api/amenities/hotel
// @access  Public
const getHotelAmenities = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: hotelAmenities.length,
    data: hotelAmenities,
  });
});

// @desc    Get all room amenities
// @route   GET /api/amenities/room
// @access  Public
const getRoomAmenities = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: roomAmenities.length,
    data: roomAmenities,
  });
});

// @desc    Get all amenities (both hotel and room)
// @route   GET /api/amenities
// @access  Public
const getAllAmenities = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      hotel: {
        count: hotelAmenities.length,
        items: hotelAmenities,
      },
      room: {
        count: roomAmenities.length,
        items: roomAmenities,
      },
    },
  });
});

module.exports = {
  getHotelAmenities,
  getRoomAmenities,
  getAllAmenities,
};
