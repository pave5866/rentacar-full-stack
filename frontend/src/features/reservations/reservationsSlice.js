import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const initialState = {
  reservations: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Yeni rezervasyon oluştur
export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'http://localhost:5000/api/reservations',
        reservationData,
        config
      );

      toast.success('Rezervasyon başarıyla oluşturuldu');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Kullanıcının rezervasyonlarını getir
export const getMyReservations = createAsyncThunk(
  'reservations/getMyReservations',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        'http://localhost:5000/api/reservations',
        config
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Tüm rezervasyonları getir (Admin)
export const getAllReservations = createAsyncThunk(
  'reservations/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        'http://localhost:5000/api/reservations/all',
        config
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Rezervasyon durumunu güncelle
export const updateReservationStatus = createAsyncThunk(
  'reservations/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `http://localhost:5000/api/reservations/${id}`,
        { status },
        config
      );

      toast.success('Rezervasyon durumu güncellendi');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
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
      .addCase(getMyReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservations = action.payload;
      })
      .addCase(getMyReservations.rejected, (state, action) => {
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
      })
      .addCase(updateReservationStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reservations = state.reservations.map((reservation) =>
          reservation._id === action.payload._id ? action.payload : reservation
        );
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = reservationsSlice.actions;
export default reservationsSlice.reducer; 