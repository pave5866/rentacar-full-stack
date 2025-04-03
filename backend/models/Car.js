const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Marka alanı zorunludur']
  },
  model: {
    type: String,
    required: [true, 'Model alanı zorunludur']
  },
  year: {
    type: Number,
    required: [true, 'Yıl alanı zorunludur']
  },
  category: {
    type: String,
    enum: ['economy', 'standard', 'luxury', 'sports', 'suv', 'van'],
    required: [true, 'Kategori alanı zorunludur']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat alanı zorunludur']
  },
  image: {
    type: String,
    required: [true, 'Resim URL alanı zorunludur']
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic'],
    required: [true, 'Vites tipi alanı zorunludur']
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
    required: [true, 'Yakıt tipi alanı zorunludur']
  },
  seats: {
    type: Number,
    required: [true, 'Koltuk sayısı alanı zorunludur'],
    min: [2, 'Koltuk sayısı en az 2 olmalıdır'],
    max: [9, 'Koltuk sayısı en fazla 9 olabilir']
  },
  mileage: {
    type: Number,
    required: [true, 'Kilometre alanı zorunludur']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  specifications: {
    transmission: String,
    seats: Number,
    fuelType: String,
    mileage: Number
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Değerlendirmeleri virtual olarak bağla
carSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'car'
});

// Araç müsaitlik kontrolü için metod
carSchema.methods.checkAvailability = async function(startDate, endDate) {
  const Reservation = mongoose.model('Reservation');
  
  // Sadece onaylanmış rezervasyonları kontrol et
  const approvedReservations = await Reservation.find({
    car: this._id,
    status: 'approved',
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });

  return {
    isAvailable: approvedReservations.length === 0,
    approvedReservations
  };
};

module.exports = mongoose.model('Car', carSchema); 