const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all blogs with filtering, search, and pagination
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    status,
    search,
    featured,
    sort = '-createdAt',
  } = req.query;

  // Build query
  const query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by status (admin only sees all, public only sees published)
  if (status) {
    query.status = status;
  } else if (!req.user || req.user.role !== 'admin') {
    query.status = 'published';
  }

  // Filter by featured
  if (featured === 'true') {
    query.featured = true;
  }

  // Search by title or content
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const blogs = await Blog.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('author', 'name email');

  // Get total count
  const total = await Blog.countDocuments(query);

  res.status(200).json({
    success: true,
    data: blogs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get single blog by ID or slug
// @route   GET /api/blogs/:identifier
// @access  Public
const getBlog = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Try to find by ID first, then by slug
  let blog;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findById(identifier).populate('author', 'name email');
  } else {
    blog = await Blog.findOne({ slug: identifier }).populate('author', 'name email');
  }

  if (!blog) {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }

  // Check if blog is published (unless admin)
  if (blog.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }

  // Increment view count
  blog.views += 1;
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, thumbnail, category, shortDescription, content, tags, status, featured } =
    req.body;

  // Check if slug already exists
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    res.status(400);
    throw new Error('Slug đã tồn tại, vui lòng chọn slug khác');
  }

  // If this blog is featured, unfeatured all other blogs
  if (featured) {
    await Blog.updateMany({ featured: true }, { featured: false });
  }

  // Use userId from token directly for the author field
  const blog = await Blog.create({
    title,
    slug,
    thumbnail,
    category,
    shortDescription,
    content,
    tags: tags || [],
    author: req.user.userId,
    status: status || 'draft',
    featured: featured || false,
  });

  res.status(201).json({
    success: true,
    data: blog,
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, thumbnail, category, shortDescription, content, tags, status, featured } =
    req.body;

  let blog = await Blog.findById(id);

  if (!blog) {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }

  // Check if new slug already exists (if slug is being changed)
  if (slug && slug !== blog.slug) {
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      res.status(400);
      throw new Error('Slug đã tồn tại, vui lòng chọn slug khác');
    }
  }

  // If this blog is being set as featured, unfeatured all other blogs
  if (featured && !blog.featured) {
    await Blog.updateMany({ _id: { $ne: id }, featured: true }, { featured: false });
  }

  // Update fields
  blog.title = title || blog.title;
  blog.slug = slug || blog.slug;
  blog.thumbnail = thumbnail !== undefined ? thumbnail : blog.thumbnail;
  blog.category = category || blog.category;
  blog.shortDescription = shortDescription || blog.shortDescription;
  blog.content = content || blog.content;
  blog.tags = tags || blog.tags;
  blog.status = status || blog.status;
  blog.featured = featured !== undefined ? featured : blog.featured;

  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Đã xóa bài viết thành công',
  });
});

// @desc    Get blog categories with count
// @route   GET /api/blogs/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const categoryLabels = {
    'travel-tips': 'Mẹo du lịch',
    destination: 'Điểm đến',
    'hotel-review': 'Đánh giá khách sạn',
    'food-culture': 'Ẩm thực & Văn hóa',
    news: 'Tin tức',
  };

  const result = categories.map((cat) => ({
    id: cat._id,
    label: categoryLabels[cat._id] || cat._id,
    count: cat.count,
  }));

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Get related blogs
// @route   GET /api/blogs/:id/related
// @access  Public
const getRelatedBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 3 } = req.query;

  const blog = await Blog.findById(id);

  if (!blog) {
    res.status(404);
    throw new Error('Không tìm thấy bài viết');
  }

  // Find blogs with same category or similar tags
  const relatedBlogs = await Blog.find({
    _id: { $ne: id },
    status: 'published',
    $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
  })
    .sort('-createdAt')
    .limit(parseInt(limit))
    .select('title slug thumbnail category shortDescription createdAt');

  res.status(200).json({
    success: true,
    data: relatedBlogs,
  });
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories,
  getRelatedBlogs,
};
