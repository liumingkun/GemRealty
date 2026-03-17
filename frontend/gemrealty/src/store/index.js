import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
  },
});

export default store;
