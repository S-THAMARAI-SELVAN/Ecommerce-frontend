import { createSlice } from '@reduxjs/toolkit';

// Retrieve saved cart items from localStorage on startup
const initialCartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

// Auxiliary helper to compute pricing details (shipping, tax, total)
const updateCartPricing = (state) => {
  // Compute price of items
  state.itemsPrice = Number(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );

  // Free shipping on orders over $100, otherwise flat $10
  state.shippingPrice = state.itemsPrice > 100 || state.itemsPrice === 0 ? 0 : 10;

  // 8% estimated tax rate
  state.taxPrice = Number((0.08 * state.itemsPrice).toFixed(2));

  // Grand Total Calculation
  state.totalPrice = Number(
    (state.itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
  );

  // Save changes to local storage
  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
};

const initialState = {
  cartItems: initialCartItems,
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

// Auto-run pricing calculation for startup state
const startupState = { ...initialState };
const tempStateRef = { cartItems: initialCartItems };
updateCartPricing(tempStateRef);
startupState.itemsPrice = tempStateRef.itemsPrice;
startupState.shippingPrice = tempStateRef.shippingPrice;
startupState.taxPrice = tempStateRef.taxPrice;
startupState.totalPrice = tempStateRef.totalPrice;

const cartSlice = createSlice({
  name: 'cart',
  initialState: startupState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      updateCartPricing(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.product !== productId);
      updateCartPricing(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export { updateCartPricing };
