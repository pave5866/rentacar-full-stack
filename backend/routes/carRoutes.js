const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  createCarReview,
  uploadCarImage,
  getAllCars,
  checkCarAvailability
} = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getCars)
  .post(protect, admin, createCar);

router.route('/:id/reviews')
  .post(protect, createCarReview);

router.route('/upload-image')
  .post(protect, admin, upload.single('image'), uploadCarImage);

router.route('/:id')
  .get(getCarById)
  .put(protect, admin, updateCar)
  .delete(protect, admin, deleteCar);

// Müsaitlik kontrolü endpoint'i
router.route('/:id/availability')
  .get(checkCarAvailability);

module.exports = router; 