const express = require('express');
const router = express.Router();
const {
  createBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  getBookings,
  getUserBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  checkAvailability,
} = require('../controllers/bookingController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/check-availability', checkAvailability);

// Authenticated
router.use(verifyToken);

// User routes
router.post('/', createBooking);
router.get('/user/:id', getUserBookings);
router.delete('/:id', deleteBooking);

// Admin workflow routes (must be before /:id to avoid conflict)
router.patch('/:id/confirm', verifyAdmin, confirmBooking);
router.patch('/:id/checkin', verifyAdmin, checkInBooking);
router.patch('/:id/checkout', verifyAdmin, checkOutBooking);

// Admin generic routes
router.get('/', verifyAdmin, getBookings);
router.patch('/:id', verifyAdmin, updateBooking);

// Single booking (after specific routes)
router.get('/:id', getBooking);

module.exports = router;
