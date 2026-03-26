const Booking = require("../models/Booking");
const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");

// ─── Helpers ────────────────────────────────────────────────────────────────

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  while (start < end) {
    dates.push(new Date(start).getTime());
    start.setDate(start.getDate() + 1);
  }
  return dates;
};

// ─── Workflow ────────────────────────────────────────────────────────────────
//
//  User creates booking  → status: pending,    paymentStatus: pending
//  Admin confirms        → status: confirmed,  paymentStatus: unchanged
//  Guest checks in       → status: checked_in, paymentStatus: unchanged
//  Guest checks out      → status: completed,  paymentStatus: paid (if pay_at_hotel)
//  User/Admin cancels    → status: cancelled,  paymentStatus: refunded (if was paid)
//
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    hotelId,
    roomId,
    roomNumberId,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    paymentMethod,
    guestInfo,
  } = req.body;

  const userId = req.user.userId;

  if (!hotelId || !roomId) {
    return res.status(400).json({
      success: false,
      error: "hotelId và roomId là bắt buộc",
    });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn) || isNaN(checkOut)) {
    return res.status(400).json({
      success: false,
      error: "Ngày check-in hoặc check-out không hợp lệ",
    });
  }

  if (checkOut <= checkIn) {
    return res.status(400).json({
      success: false,
      error: "Ngày check-out phải sau ngày check-in",
    });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ success: false, error: "Không tìm thấy phòng" });
  }

  if (room.availableRooms <= 0) {
    return res.status(400).json({
      success: false,
      error: "Phòng đã hết chỗ trống",
    });
  }

  if (numberOfGuests && numberOfGuests > room.maxPeople) {
    return res.status(400).json({
      success: false,
      error: `Phòng chỉ chứa tối đa ${room.maxPeople} khách`,
    });
  }

  const nights = getDatesInRange(checkIn, checkOut).length;
  const totalPrice = room.price * nights;

  // Determine initial payment status based on method
  const isOnlinePayment = ["credit_card", "debit_card", "paypal", "bank_transfer"].includes(paymentMethod);
  const initialPaymentStatus = isOnlinePayment ? "paid" : "pending";

  const booking = await Booking.create({
    userId,
    hotelId,
    roomId,
    roomNumberId: roomNumberId || roomId,
    roomNumber: 1,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    numberOfGuests: numberOfGuests || 1,
    totalPrice,
    paymentMethod: paymentMethod || "cash",
    paymentStatus: initialPaymentStatus,
    status: "pending",
    guestInfo: guestInfo || {},
  });

  // Decrease available rooms
  await Room.findByIdAndUpdate(roomId, { $inc: { availableRooms: -1 } });

  res.status(201).json({
    success: true,
    message: "Đặt phòng thành công. Vui lòng chờ admin xác nhận.",
    data: booking,
  });
});

// @desc    Confirm booking (admin)
// @route   PATCH /api/v1/bookings/:id/confirm
// @access  Private/Admin
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, error: "Không tìm thấy đặt phòng" });
  }

  if (booking.status !== "pending") {
    return res.status(400).json({
      success: false,
      error: `Không thể xác nhận đặt phòng có trạng thái '${booking.status}'`,
    });
  }

  booking.status = "confirmed";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Đã xác nhận đặt phòng",
    data: booking,
  });
});

// @desc    Check-in booking (admin)
// @route   PATCH /api/v1/bookings/:id/checkin
// @access  Private/Admin
const checkInBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, error: "Không tìm thấy đặt phòng" });
  }

  if (booking.status !== "confirmed") {
    return res.status(400).json({
      success: false,
      error: `Chỉ có thể check-in đặt phòng đã xác nhận. Trạng thái hiện tại: '${booking.status}'`,
    });
  }

  booking.status = "checked_in";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Đã check-in thành công",
    data: booking,
  });
});

// @desc    Check-out / Complete booking (admin)
// @route   PATCH /api/v1/bookings/:id/checkout
// @access  Private/Admin
const checkOutBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, error: "Không tìm thấy đặt phòng" });
  }

  if (booking.status !== "checked_in") {
    return res.status(400).json({
      success: false,
      error: `Chỉ có thể check-out đặt phòng đang check-in. Trạng thái hiện tại: '${booking.status}'`,
    });
  }

  booking.status = "completed";
  // If pay at hotel, mark as paid on checkout
  if (booking.paymentMethod === "cash" && booking.paymentStatus === "pending") {
    booking.paymentStatus = "paid";
  }
  await booking.save();

  // Release room back to inventory after checkout
  await Room.findByIdAndUpdate(booking.roomId, { $inc: { availableRooms: 1 } });

  res.status(200).json({
    success: true,
    message: "Đã check-out và hoàn thành đặt phòng",
    data: booking,
  });
});

// @desc    Cancel booking (user or admin)
// @route   DELETE /api/v1/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, error: "Không tìm thấy đặt phòng" });
  }

  const isOwner = booking.userId.toString() === req.user.userId;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, error: "Không có quyền truy cập" });
  }

  if (booking.status === "cancelled") {
    return res.status(400).json({ success: false, error: "Đặt phòng đã bị hủy trước đó" });
  }

  if (booking.status === "completed") {
    return res.status(400).json({ success: false, error: "Không thể hủy đặt phòng đã hoàn thành" });
  }

  const wasActive = ["pending", "confirmed", "checked_in"].includes(booking.status);

  booking.status = "cancelled";
  // Refund if already paid
  if (booking.paymentStatus === "paid") {
    booking.paymentStatus = "refunded";
  }
  await booking.save();

  // Release room back to inventory
  if (wasActive) {
    await Room.findByIdAndUpdate(booking.roomId, { $inc: { availableRooms: 1 } });
  }

  res.status(200).json({
    success: true,
    message: "Đã hủy đặt phòng thành công",
    data: booking,
  });
});

// @desc    Update booking payment status (admin)
// @route   PATCH /api/v1/bookings/:id
// @access  Private/Admin
const updateBooking = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Không tìm thấy đặt phòng" });
  }

  const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({
      success: false,
      error: `Trạng thái thanh toán không hợp lệ: ${paymentStatus}`,
    });
  }

  if (paymentStatus) booking.paymentStatus = paymentStatus;

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Đã cập nhật đặt phòng",
    data: booking,
  });
});

// @desc    Get all bookings (admin)
// @route   GET /api/v1/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const { status, paymentStatus, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const query = {};
  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const skip = (Number(page) - 1) * Number(limit);

  const bookings = await Booking.find(query)
    .populate("userId", "name email phone")
    .populate("hotelId", "name city")
    .populate("roomId", "title price")
    .skip(skip)
    .limit(Number(limit))
    .sort(sort);

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: bookings,
  });
});

// @desc    Get user bookings
// @route   GET /api/v1/bookings/user/:id
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (req.user.userId !== userId && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Chỉ có thể xem đặt phòng của chính mình",
    });
  }

  const bookings = await Booking.find({ userId })
    .populate("hotelId", "name city address images")
    .populate("roomId", "title price images")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email phone")
    .populate("hotelId", "name city address")
    .populate("roomId", "title price");

  if (!booking) {
    return res.status(404).json({ success: false, error: "Không tìm thấy đặt phòng" });
  }

  if (
    booking.userId._id.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, error: "Không có quyền truy cập" });
  }

  res.status(200).json({ success: true, data: booking });
});

// @desc    Check room availability
// @route   GET /api/v1/bookings/check-availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ success: false, error: "roomId là bắt buộc" });
  }

  const room = await Room.findById(roomId).select("availableRooms totalRooms");
  if (!room) {
    return res.status(404).json({ success: false, error: "Không tìm thấy phòng" });
  }

  res.status(200).json({
    success: true,
    data: {
      roomId,
      available: room.availableRooms > 0,
      availableRooms: room.availableRooms,
      totalRooms: room.totalRooms,
    },
  });
});

module.exports = {
  createBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  deleteBooking,
  updateBooking,
  getBookings,
  getUserBookings,
  getBooking,
  checkAvailability,
};
