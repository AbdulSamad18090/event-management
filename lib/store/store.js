const { configureStore } = require("@reduxjs/toolkit");
import eventSlice from "../features/eventSlice";

const store = configureStore({
  reducer: {
    event: eventSlice,
  },
});

export default store;
