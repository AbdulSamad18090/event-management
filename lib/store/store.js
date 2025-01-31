const { configureStore } = require("@reduxjs/toolkit");
import eventSlice from "../features/eventSlice";
import organizerSlice from "../features/organizerSlice";
import cartSlice from "../features/cartSlice";

const store = configureStore({
  reducer: {
    event: eventSlice,
    organizer: organizerSlice,
    cart: cartSlice,
  },
});

export default store;
