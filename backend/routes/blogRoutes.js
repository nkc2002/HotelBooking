const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories,
  getRelatedBlogs,
} = require('../controllers/blogController');
const { verifyToken, verifyAdmin, attachUser } = require('../middleware/authMiddleware');

// Public routes
router.get('/', attachUser, getBlogs);
router.get('/categories', getCategories);
router.get('/:identifier', getBlog);
router.get('/:id/related', getRelatedBlogs);

// Admin routes
router.post('/', verifyToken, verifyAdmin, createBlog);
router.put('/:id', verifyToken, verifyAdmin, updateBlog);
router.delete('/:id', verifyToken, verifyAdmin, deleteBlog);

module.exports = router;
