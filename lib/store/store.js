const { configureStore } = require("@reduxjs/toolkit");
import eventSlice from "../features/eventSlice";
import organizerSlice from "../features/organizerSlice";
import cartSlice from "../features/cartSlice";
import reviewSlice from "../features/reviewSlice";

const store = configureStore({
  reducer: {
    event: eventSlice,
    organizer: organizerSlice,
    cart: cartSlice,
    review: reviewSlice,
  },
});

export default store;
