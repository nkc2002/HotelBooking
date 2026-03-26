const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Please provide hotel ID'],
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Please provide booking ID'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Each booking can only be reviewed once
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ userId: 1, hotelId: 1 });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (hotelId) {
  const result = await this.aggregate([
    { $match: { hotelId: hotelId } },
    {
      $group: {
        _id: '$hotelId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
      rating: result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0,
    });
  } catch (error) {
    console.error(error);
  }
};

// Update hotel rating after save
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.hotelId);
});

// Update hotel rating after remove
reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.hotelId);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
