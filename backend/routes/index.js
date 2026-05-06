const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const hotelRoutes = require('./hotelRoutes');
const roomRoutes = require('./roomRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');
const amenityRoutes = require('./amenityRoutes');
const blogRoutes = require('./blogRoutes');
const chatRoutes = require('./chatRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/amenities', amenityRoutes);
router.use('/blogs', blogRoutes);
router.use('/chat', chatRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
