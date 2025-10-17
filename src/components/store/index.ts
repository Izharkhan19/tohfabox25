import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,  // New
    filters: filtersReducer // New
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;