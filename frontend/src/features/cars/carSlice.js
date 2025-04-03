import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import carService from './carService';

const initialState = {
  cars: [],
  car: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all cars
export const getCars = createAsyncThunk(
  'cars/getAll',
  async (filters, thunkAPI) => {
    try {
      return await carService.getCars(filters);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get car by ID
export const getCarById = createAsyncThunk(
  'cars/getById',
  async (id, thunkAPI) => {
    try {
      return await carService.getCarById(id);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create car review
export const createCarReview = createAsyncThunk(
  'cars/createReview',
  async ({ carId, reviewData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await carService.createCarReview(carId, reviewData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCars.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cars = action.payload;
      })
      .addCase(getCars.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCarById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCarById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.car = action.payload;
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCarReview.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.cars.findIndex(
          (car) => car._id === action.payload.carId
        );
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        if (state.car?._id === action.payload.carId) {
          state.car = action.payload;
        }
      });
  },
});

export const { reset } = carSlice.actions;
export default carSlice.reducer; 