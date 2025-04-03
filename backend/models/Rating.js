const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Car'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    isVerifiedRental: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Bir kullanıcı bir arabaya sadece bir kez değerlendirme yapabilir
ratingSchema.index({ user: 1, car: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema); 