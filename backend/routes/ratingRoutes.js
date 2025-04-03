const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Car = require('../models/Car');
const Reservation = require('../models/Reservation');
const { protect } = require('../middleware/authMiddleware');

// Derecelendirme route'ları buraya eklenecek
router.get('/', (req, res) => {
  res.json({ message: 'Derecelendirme route\'ları aktif' });
});

// Bir araca değerlendirme ekle
router.post('/:carId', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const carId = req.params.carId;
    const userId = req.user.id;

    // Rating değerini kontrol et
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Geçerli bir değerlendirme puanı girin (1-5)' });
    }

    // Kullanıcının bu arabayı daha önce kiraladığını kontrol et
    const hasRental = await Reservation.findOne({
      user: userId,
      car: carId,
      status: 'completed'
    });

    // Kullanıcının bu arabayı daha önce değerlendirip değerlendirmediğini kontrol et
    const existingRating = await Rating.findOne({ user: userId, car: carId });
    if (existingRating) {
      return res.status(400).json({ message: 'Bu araç için zaten bir değerlendirme yapmışsınız' });
    }

    // Yeni değerlendirmeyi oluştur
    const newRating = await Rating.create({
      user: userId,
      car: carId,
      rating,
      isVerifiedRental: !!hasRental
    });

    // Aracın ortalama puanını güncelle
    const car = await Car.findById(carId);
    const allRatings = await Rating.find({ car: carId });
    
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;

    car.rating = {
      average: averageRating,
      count: allRatings.length
    };
    await car.save();

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Değerlendirme eklenirken bir hata oluştu' });
  }
});

// Bir aracın değerlendirmelerini getir
router.get('/:carId', async (req, res) => {
  try {
    const ratings = await Rating.find({ car: req.params.carId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Değerlendirmeler getirilirken bir hata oluştu' });
  }
});

// Bir değerlendirmeyi sil (sadece kendi değerlendirmesini silebilir)
router.delete('/:ratingId', protect, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({ message: 'Değerlendirme bulunamadı' });
    }

    // Değerlendirmenin sahibi olduğunu kontrol et
    if (rating.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    await rating.remove();

    // Aracın ortalama puanını güncelle
    const car = await Car.findById(rating.car);
    const allRatings = await Rating.find({ car: rating.car });
    
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allRatings.length > 0 ? totalRating / allRatings.length : 0;

    car.rating = {
      average: averageRating,
      count: allRatings.length
    };
    await car.save();

    res.json({ message: 'Değerlendirme başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Değerlendirme silinirken bir hata oluştu' });
  }
});

module.exports = router; 