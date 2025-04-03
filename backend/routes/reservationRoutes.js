const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus
} = require('../controllers/reservationController');

router.route('/')
  .post(protect, createReservation)
  .get(protect, getMyReservations);

router.route('/all')
  .get(protect, admin, getAllReservations);

router.route('/:id')
  .put(protect, updateReservationStatus);

module.exports = router; 