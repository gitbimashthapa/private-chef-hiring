const mongoose = require('mongoose');

const ChefProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  cuisine: {
    type: [String],
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  profileImage: {
    type: String
  },
  // To track availability
  availability: {
    type: [Date], // Array of available dates
    default: []
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('ChefProfile', ChefProfileSchema);