const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
  getUserStats,
} = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Protected routes (logged in users)
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

// Admin only routes
router.get('/stats', verifyToken, verifyAdmin, getUserStats);
router.get('/', verifyToken, verifyAdmin, getUsers);
router.get('/:id', verifyToken, verifyAdmin, getUser);
router.post('/', verifyToken, verifyAdmin, createUser);
router.put('/:id', verifyToken, verifyAdmin, updateUser);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
