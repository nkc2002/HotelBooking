const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getHotelReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getEligibleBookings,
} = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

// Admin route
router.get('/', verifyToken, getAllReviews);

// Public routes
router.get('/hotel/:hotelId', getHotelReviews);

// Protected routes (order matters — specific paths before :id)
router.get('/eligible/:hotelId', verifyToken, getEligibleBookings);
router.get('/user/:userId', verifyToken, getUserReviews);
router.get('/:id', getReview);

router.post('/', verifyToken, createReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
