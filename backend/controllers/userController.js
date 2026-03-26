const User = require("../models/User");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all users (Admin)
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj = {};

  // Filter by role
  if (req.query.role) {
    queryObj.role = req.query.role;
  }

  // Search by name or email
  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const users = await User.find(queryObj)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// @desc    Get single user (Admin)
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create user (Admin)
// @route   POST /api/v1/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "User with this email already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "user",
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// @desc    Update user (Admin)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, role } = req.body;

  let user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      });
    }
  }

  user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, role },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  // Prevent deleting self
  if (user._id.toString() === req.user.userId) {
    return res.status(400).json({
      success: false,
      error: "Cannot delete your own account",
    });
  }

  // Cancel active bookings of this user
  await Booking.updateMany(
    { userId: user._id, status: { $nin: ["cancelled", "checked_out"] } },
    { $set: { status: "cancelled" } }
  );

  // Get hotel IDs from user's reviews before deleting (to recalculate ratings)
  const userReviews = await Review.find({ userId: user._id });
  const hotelIds = userReviews.map((r) => r.hotelId);

  // Delete user's reviews
  await Review.deleteMany({ userId: user._id });

  // Recalculate ratings for affected hotels
  for (const hotelId of hotelIds) {
    await Review.calculateAverageRating(hotelId);
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: {},
  });
});

// @desc    Update user profile (Self)
// @route   PUT /api/v1/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  let user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      });
    }
  }

  user = await User.findByIdAndUpdate(
    req.user.userId,
    { name, email, phone },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

// @desc    Change password (Self)
// @route   PUT /api/v1/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Please provide current password and new password",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: "New password must be at least 6 characters",
    });
  }

  const user = await User.findById(req.user.userId).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: "Current password is incorrect",
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc    Get user stats (Admin)
// @route   GET /api/v1/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: "admin" });
  const userCount = await User.countDocuments({ role: "user" });

  // Users registered in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      adminCount,
      userCount,
      newUsers,
    },
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
  getUserStats,
};

