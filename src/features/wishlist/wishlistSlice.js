import { createSlice } from '@reduxjs/toolkit';

// Retrieve saved wishlist items from localStorage on startup
const initialWishlistItems = localStorage.getItem('wishlistItems')
  ? JSON.parse(localStorage.getItem('wishlistItems'))
  : [];

const initialState = {
  wishlistItems: initialWishlistItems,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload; // Contains: product (id), name, image, price, category
      const existItem = state.wishlistItems.find((x) => x.product === item.product);

      if (!existItem) {
        state.wishlistItems.push(item);
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter((x) => x.product !== productId);
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem('wishlistItems');
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
