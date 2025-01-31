// redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load cart from sessionStorage (empty when browser is closed)
const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedCart = sessionStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  }
  return { items: [] };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { eventId, title, pricing, quantities } = action.payload;

      // Filter out zero-quantity tickets
      const selectedTickets = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([type, qty]) => ({
          type,
          qty,
          price: pricing[type] * qty,
        }));

      if (selectedTickets.length === 0) return;

      const existingEventIndex = state.items.findIndex(
        (item) => item.eventId === eventId
      );

      if (existingEventIndex !== -1) {
        state.items[existingEventIndex].tickets.push(...selectedTickets);
      } else {
        state.items.push({
          eventId,
          title,
          tickets: selectedTickets,
        });
      }

      // Save to sessionStorage
      sessionStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.eventId !== action.payload);
      sessionStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
