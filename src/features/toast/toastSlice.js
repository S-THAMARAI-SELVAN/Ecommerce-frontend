import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { message, type = 'info' } = action.payload;
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      state.toasts.push({ id, message, type });
    },
    removeToast: (state, action) => {
      const id = action.payload;
      state.toasts = state.toasts.filter((toast) => toast.id !== id);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
