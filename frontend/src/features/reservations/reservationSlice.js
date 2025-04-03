import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reservationService from './reservationService';

const initialState = {
  reservations: [],
  reservation: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create reservation
export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reservationService.createReservation(reservationData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user reservations
export const getUserReservations = createAsyncThunk(
  'reservations/getUserReservations',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reservationService.getUserReservations(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all reservations (admin)
export const getAllReservations = createAsyncThunk(
  'reservations/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reservationService.getAllReservations(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reservationSlice = createSlice({
  name: 'reservations',
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
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservations = action.payload;
      })
      .addCase(getUserReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservations = action.payload;
      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = reservationSlice.actions;
export default reservationSlice.reducer; 