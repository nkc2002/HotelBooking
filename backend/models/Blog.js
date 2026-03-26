const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề bài viết là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Danh mục là bắt buộc'],
      enum: ['travel-tips', 'destination', 'hotel-review', 'food-culture', 'news'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Mô tả ngắn là bắt buộc'],
      maxlength: [500, 'Mô tả ngắn không được vượt quá 500 ký tự'],
    },
    content: {
      type: String,
      required: [true, 'Nội dung bài viết là bắt buộc'],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      default: 'Admin',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
blogSchema.index({ title: 'text', shortDescription: 'text', content: 'text' });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ createdAt: -1 });

// Pre-save hook to set publishedAt when status changes to published
blogSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for reading time estimation
blogSchema.virtual('readingTime').get(function () {
  const wordsPerMinute = 200;
  const words = this.content ? this.content.split(/\s+/).length : 0;
  return Math.ceil(words / wordsPerMinute);
});

// Ensure virtuals are included in JSON output
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);
