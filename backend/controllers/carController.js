const Car = require('../models/Car');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      Object.assign(car, req.body);
      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      // Eğer araç resmi uploads klasöründe ise sil
      if (car.image && car.image.includes('/uploads/')) {
        const imagePath = path.join(__dirname, '..', car.image.replace(/^\//, ''));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await Car.deleteOne({ _id: req.params.id });
      res.json({ message: 'Araç başarıyla silindi' });
    } else {
      res.status(404).json({ message: 'Araç bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Araç silinirken bir hata oluştu' });
  }
};

// @desc    Create car review
// @route   POST /api/cars/:id/reviews
// @access  Private
const createCarReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const car = await Car.findById(req.params.id);

    if (car) {
      const alreadyReviewed = car.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Car already reviewed' });
        return;
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment,
      };

      car.reviews.push(review);
      car.rating =
        car.reviews.reduce((acc, item) => item.rating + acc, 0) /
        car.reviews.length;

      await car.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload car image
// @route   POST /api/cars/upload-image
// @access  Private/Admin
const uploadCarImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir resim seçin' });
    }

    // Eğer eski resim varsa ve uploads klasöründe ise sil
    if (req.body.oldImage) {
      const oldImagePath = path.join(__dirname, '..', req.body.oldImage.replace(/^\//, ''));
      if (fs.existsSync(oldImagePath) && oldImagePath.includes('uploads')) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Yeni resim yolunu oluştur
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({ 
      message: 'Resim başarıyla yüklendi',
      imageUrl 
    });
  } catch (error) {
    res.status(500).json({ message: 'Resim yüklenemedi' });
  }
};

// @desc    Araç müsaitlik kontrolü
// @route   GET /api/cars/:id/availability
// @access  Public
const checkCarAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Başlangıç ve bitiş tarihleri gereklidir');
  }

  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(404);
    throw new Error('Araç bulunamadı');
  }

  try {
    const availability = await car.checkAvailability(
      new Date(startDate),
      new Date(endDate)
    );
    res.json(availability);
  } catch (error) {
    res.status(400);
    throw new Error('Müsaitlik kontrolü yapılırken bir hata oluştu: ' + error.message);
  }
});

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  createCarReview,
  uploadCarImage,
  checkCarAvailability,
}; 