const { configureStore } = require("@reduxjs/toolkit");
import eventSlice from "../features/eventSlice";
import organizerSlice from "../features/organizerSlice";

const store = configureStore({
  reducer: {
    event: eventSlice,
    organizer: organizerSlice,
  },
});

export default store;
