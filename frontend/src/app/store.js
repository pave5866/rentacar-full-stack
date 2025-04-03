import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import carReducer from '../features/cars/carSlice';
import reservationReducer from '../features/reservations/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    cars: carReducer,
    reservations: reservationReducer,
  },
}); 