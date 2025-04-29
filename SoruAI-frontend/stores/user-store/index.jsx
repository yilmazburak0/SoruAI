import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getTokenFromCookies = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return value;
      }
    }
  }
  return null;
};

// Async thunk for verifying token
export const verifyToken = createAsyncThunk(
  'user/verifyToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Önce mevcut state'e bakalım, eğer kullanıcı zaten authenticate edilmişse
      // gereksiz API çağrısı yapmayalım
      const currentState = getState().user;
      if (currentState.isAuthenticated && currentState.user) {
        return {
          valid: true,
          user: currentState.user
        };
      }
      
      const token = getTokenFromCookies();
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.post('http://localhost:5003/auth/verify-token', 
        { token }, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to verify token');
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    // Clear the token cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return true;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Login başarılı olduğunda doğrudan user state'ini güncelle
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.valid) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { loginSuccess } = userSlice.actions;

export default userSlice.reducer;