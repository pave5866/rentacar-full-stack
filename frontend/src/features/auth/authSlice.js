import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { toast } from 'react-hot-toast';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      const response = await authService.register(user);
      if (response) {
        toast.success('Hesabınız başarıyla oluşturuldu', {
          id: 'register-success',
          duration: 4000
        });
        return response;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Bir hata oluştu';
      toast.error(message, {
        id: 'register-error',
        duration: 4000
      });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      const response = await authService.login(user);
      if (response) {
        toast.success('Başarıyla giriş yapıldı', {
          id: 'login-success',
          duration: 4000
        });
        return response;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Giriş yapılamadı';
      toast.error(message, {
        id: 'login-error',
        duration: 4000
      });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authService.logout();
      toast.success('Başarıyla çıkış yapıldı', {
        id: 'logout-success'
      });
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu', {
        id: 'logout-error'
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset, setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer; 