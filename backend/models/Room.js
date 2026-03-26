const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Please provide hotel ID'],
    },
    title: {
      type: String,
      required: [true, 'Please provide room title'],
      trim: true,
      maxlength: [100, 'Room title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide room price'],
      min: [0, 'Price cannot be negative'],
    },
    maxPeople: {
      type: Number,
      required: [true, 'Please provide max people'],
      min: [1, 'Max people must be at least 1'],
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    totalRooms: {
      type: Number,
      required: [true, 'Please provide total rooms'],
      min: [1, 'Total rooms must be at least 1'],
    },
    availableRooms: {
      type: Number,
      required: [true, 'Please provide available rooms'],
      min: [0, 'Available rooms cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure availableRooms doesn't exceed totalRooms
roomSchema.pre('save', function (next) {
  if (this.availableRooms > this.totalRooms) {
    this.availableRooms = this.totalRooms;
  }
  next();
});

// Index for faster queries
roomSchema.index({ hotelId: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ availableRooms: 1 });

module.exports = mongoose.model('Room', roomSchema);
