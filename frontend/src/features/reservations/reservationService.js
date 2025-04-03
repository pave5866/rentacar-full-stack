import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reservations/';

// Create reservation
const createReservation = async (reservationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, reservationData, config);
  return response.data;
};

// Get user reservations
const getUserReservations = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get all reservations (admin)
const getAllReservations = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}admin`, config);
  return response.data;
};

const reservationService = {
  createReservation,
  getUserReservations,
  getAllReservations,
};

export default reservationService; 