const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
  removeRoomAvailability,
  checkRoomAvailability,
} = require('../controllers/roomController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/check-availability/:id', checkRoomAvailability);

// Admin only routes
router.post('/', verifyAdmin, createRoom);
router.put('/:id', verifyAdmin, updateRoom);
router.delete('/:id', verifyAdmin, deleteRoom);

// Availability management (Admin)
router.put('/availability/:id', verifyAdmin, updateRoomAvailability);
router.delete('/availability/:id', verifyAdmin, removeRoomAvailability);

module.exports = router;
