import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cars/';

// Get all cars
const getCars = async (filters) => {
  const { category, search } = filters;
  let url = API_URL;
  
  if (category || search) {
    url += '?';
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;
    url = url.slice(0, -1); // Remove last '&'
  }

  const response = await axios.get(url);
  return response.data;
};

// Get car by ID
const getCarById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Create car review
const createCarReview = async (carId, reviewData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + carId + '/reviews',
    reviewData,
    config
  );

  return response.data;
};

const carService = {
  getCars,
  getCarById,
  createCarReview,
};

export default carService; 