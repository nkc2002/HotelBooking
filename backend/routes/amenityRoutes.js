const express = require('express');
const router = express.Router();
const {
  getHotelAmenities,
  getRoomAmenities,
  getAllAmenities,
} = require('../controllers/amenityController');

// Public routes
router.get('/', getAllAmenities);
router.get('/hotel', getHotelAmenities);
router.get('/room', getRoomAmenities);

module.exports = router;
