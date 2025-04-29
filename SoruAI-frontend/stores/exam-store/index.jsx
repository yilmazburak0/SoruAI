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

// Async thunk for fetching exams
export const fetchExams = createAsyncThunk(
  'exams/fetchExams',
  async (_, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookies();
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.get('http://localhost:5003/exams/', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true // Keep this to ensure cookies are sent
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch exams');
    }
  }
);

const examsSlice = createSlice({
  name: 'exams',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default examsSlice.reducer;