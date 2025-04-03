const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');
const Car = require('../models/Car');
const Settings = require('../models/Settings');

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate } = req.body;

  // Tarihleri kontrol et
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    res.status(400);
    throw new Error('Başlangıç tarihi bitiş tarihinden önce olmalıdır');
  }

  // Aracı bul
  const car = await Car.findById(carId);
  if (!car) {
    res.status(404);
    throw new Error('Araç bulunamadı');
  }

  // Tarih çakışması kontrolü
  const conflictingReservation = await Reservation.findOne({
    car: carId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ]
  });

  if (conflictingReservation) {
    res.status(400);
    throw new Error('Seçilen tarihler için araç müsait değil');
  }

  // Toplam fiyat hesaplama
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = days * car.price;

  // Rezervasyon oluştur
  const reservation = await Reservation.create({
    user: req.user.id,
    car: carId,
    startDate: start,
    endDate: end,
    totalPrice,
    status: 'pending'
  });

  res.status(201).json(reservation);
});

// @desc    Get user reservations
// @route   GET /api/reservations
// @access  Private
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id })
    .populate('car')
    .sort('-createdAt');
  res.json(reservations);
});

// @desc    Get all reservations (admin)
// @route   GET /api/reservations/all
// @access  Private/Admin
const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({})
    .populate('car')
    .populate('user', 'name email phone')
    .sort('-createdAt');
  res.json(reservations);
});

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private/Admin
const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findById(req.params.id)
    .populate('car')
    .populate('user');

  if (!reservation) {
    res.status(404);
    throw new Error('Rezervasyon bulunamadı');
  }

  // Kullanıcı kendi rezervasyonunu iptal edebilir veya admin tüm durumları değiştirebilir
  if (req.user.role !== 'admin' && reservation.user._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Bu işlem için yetkiniz yok');
  }

  // Normal kullanıcılar sadece iptal edebilir
  if (req.user.role !== 'admin' && status !== 'cancelled') {
    res.status(403);
    throw new Error('Sadece rezervasyonu iptal edebilirsiniz');
  }

  // Tamamlanmış veya iptal edilmiş rezervasyonlar değiştirilemez
  if (['completed', 'cancelled'].includes(reservation.status)) {
    res.status(400);
    throw new Error('Bu rezervasyonun durumu değiştirilemez');
  }

  reservation.status = status;
  const updatedReservation = await reservation.save();

  res.json(updatedReservation);
});

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus
}; 