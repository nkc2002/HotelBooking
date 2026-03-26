const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const {
    hotelId,
    minPrice,
    maxPrice,
    maxPeople,
    limit = 10,
    page = 1,
  } = req.query;

  // Build query
  const query = {};

  if (hotelId) {
    query.hotelId = hotelId;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (maxPeople) {
    query.maxPeople = { $gte: Number(maxPeople) };
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const rooms = await Room.find(query)
    .populate("hotelId", "name city")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Room.countDocuments(query);

  res.status(200).json({
    success: true,
    count: rooms.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: rooms,
  });
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate(
    "hotelId",
    "name city address"
  );

  if (!room) {
    return res.status(404).json({
      success: false,
      error: "Room not found",
    });
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Create room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = asyncHandler(async (req, res) => {
  const { hotelId } = req.body;

  // Check if hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({
      success: false,
      error: "Hotel not found",
    });
  }

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      error: "Room not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      error: "Room not found",
    });
  }

  // Cancel all active bookings for this room
  await Booking.updateMany(
    { roomId: room._id, status: { $nin: ["cancelled", "checked_out"] } },
    { $set: { status: "cancelled" } }
  );

  await room.deleteOne();

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
    data: {},
  });
});

// @desc    Update room availability (add unavailable dates)
// @route   PUT /api/rooms/availability/:id
// @access  Private/Admin
const updateRoomAvailability = asyncHandler(async (req, res) => {
  const { roomNumberId, dates } = req.body; // roomNumberId and array of dates

  if (!roomNumberId || !dates || !Array.isArray(dates)) {
    return res.status(400).json({
      success: false,
      error: "Please provide roomNumberId and dates array",
    });
  }

  // Convert dates to Date objects
  const datesToAdd = dates.map((date) => new Date(date));

  const room = await Room.findOneAndUpdate(
    { _id: req.params.id, "roomNumbers._id": roomNumberId },
    {
      $push: {
        "roomNumbers.$.unavailableDates": { $each: datesToAdd },
      },
    },
    { new: true }
  );

  if (!room) {
    return res.status(404).json({
      success: false,
      error: "Room or room number not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Room availability updated",
    data: room,
  });
});

// @desc    Remove unavailable dates from room
// @route   DELETE /api/rooms/availability/:id
// @access  Private/Admin
const removeRoomAvailability = asyncHandler(async (req, res) => {
  const { roomNumberId, dates } = req.body;

  if (!roomNumberId || !dates || !Array.isArray(dates)) {
    return res.status(400).json({
      success: false,
      error: "Please provide roomNumberId and dates array",
    });
  }

  // Convert dates to timestamps for comparison
  const datesToRemove = dates.map((date) => new Date(date));

  const room = await Room.findOneAndUpdate(
    { _id: req.params.id, "roomNumbers._id": roomNumberId },
    {
      $pull: {
        "roomNumbers.$.unavailableDates": { $in: datesToRemove },
      },
    },
    { new: true }
  );

  if (!room) {
    return res.status(404).json({
      success: false,
      error: "Room or room number not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Unavailable dates removed",
    data: room,
  });
});

// @desc    Check room availability
// @route   POST /api/rooms/check-availability/:id
// @access  Public
const checkRoomAvailability = asyncHandler(async (req, res) => {
  const { roomNumberId, checkInDate, checkOutDate } = req.body;

  if (!roomNumberId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      success: false,
      error: "Please provide roomNumberId, checkInDate and checkOutDate",
    });
  }

  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      error: "Room not found",
    });
  }

  const roomNumber = room.roomNumbers.find(
    (rn) => rn._id.toString() === roomNumberId
  );

  if (!roomNumber) {
    return res.status(404).json({
      success: false,
      error: "Room number not found",
    });
  }

  // Get all dates between check-in and check-out
  const getDatesInRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    while (startDate < endDate) {
      dates.push(new Date(startDate).getTime());
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  };

  const requestedDates = getDatesInRange(checkInDate, checkOutDate);
  const unavailableTimes = roomNumber.unavailableDates.map((date) =>
    new Date(date).getTime()
  );

  const isAvailable = !requestedDates.some((date) =>
    unavailableTimes.includes(date)
  );

  res.status(200).json({
    success: true,
    data: {
      roomId: room._id,
      roomNumberId: roomNumber._id,
      roomNumber: roomNumber.number,
      checkInDate,
      checkOutDate,
      isAvailable,
    },
  });
});

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
  removeRoomAvailability,
  checkRoomAvailability,
};

