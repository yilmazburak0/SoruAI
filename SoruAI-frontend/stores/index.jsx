import { configureStore } from '@reduxjs/toolkit';
import examsReducer from './exam-store/index.jsx';
import userReducer from './user-store/index.jsx';

export const store = configureStore({
  reducer: {
    exams: examsReducer,
    user: userReducer,
  },
});