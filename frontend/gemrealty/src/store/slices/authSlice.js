import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, updateProfile as updateProfileApi } from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser(username, password);
      // Store token in local storage
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.detail || 'Login failed');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.detail || 'Registration failed');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await updateProfileApi(profileData);
      return { ...data, email: profileData.email };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.detail || 'Update failed');
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {

  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = {
          username: action.payload.username,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to login';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to register';
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        if (action.payload.email && state.user) {
          state.user.email = action.payload.email;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
