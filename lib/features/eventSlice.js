import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchEventsOfOrganizer = createAsyncThunk(
  "event/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/event/get/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      return data.events;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/delete/id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/event/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsOfOrganizer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsOfOrganizer.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsOfOrganizer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        // state.loading = false;
        state.events = state.events.filter(
          (event) => event._id !== action.payload.deletedEvent._id
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
