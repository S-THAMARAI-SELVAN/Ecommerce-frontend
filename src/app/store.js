import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import toastReducer from '../features/toast/toastSlice.js';
import wishlistReducer from '../features/wishlist/wishlistSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    toast: toastReducer,
    wishlist: wishlistReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Enables redux devtools only in dev modes
});

export default store;
