const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  // Mail gönderimi için gerekli alanlar (Yorum satırında bekleyecek)
  /*
  mailStatus: {
    userNotified: { type: Boolean, default: false },
    adminNotified: { type: Boolean, default: false },
    statusChangeNotified: { type: Boolean, default: false }
  },
  */
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema); 