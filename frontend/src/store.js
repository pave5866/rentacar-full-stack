import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';
import carsReducer from './features/cars/carsSlice';
import reservationsReducer from './features/reservations/reservationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    cars: carsReducer,
    reservations: reservationsReducer,
  },
}); 