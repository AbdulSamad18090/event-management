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

export const updateEvent = createAsyncThunk(
  "/event/update/id",
  async (eventData, { rejectWithValue }) => {
    try {
      const { id, event } = eventData; // Extract the event ID and other fields

      const response = await fetch(`/api/event/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Ensure you're sending JSON
        },
        body: JSON.stringify(event), // Send the event data
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const data = await response.json();
      return data; // This data will be passed as the action payload
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);

export const fetchAllEvents = createAsyncThunk(
  "/api/event/get/all",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/event/get/all?page=${page}&limit=${limit}`
      );

      const data = await response.json();
      // console.log("response =>", data);
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
    allEvents: [],
    pagination: {},
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
      })
      .addCase(updateEvent.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        // state.loading = false;
        state.events = state.events.map((event) =>
          event._id === action.payload.updatedEvent._id
            ? action.payload.updatedEvent
            : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.allEvents = action.payload.events; // Replace with the current page's data
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
