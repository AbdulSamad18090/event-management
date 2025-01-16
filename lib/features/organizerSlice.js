import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOrganizers = createAsyncThunk(
  "/organizer/get/all",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/organizer/get/all?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        // If the response is not ok, throw an error with the status text
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
    //   console.log("Response =>", data);
      return data;
    } catch (error) {
      console.log("Error fetching organizers =>", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const organizerSlice = createSlice({
  name: "organizer",
  initialState: {
    organizers: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizers.fulfilled, (state, action) => {
        state.organizers = action.payload.organizers; // Populate organizers data
        state.pagination = action.payload.pagination; // Populate pagination data
        state.loading = false;
      })
      .addCase(fetchOrganizers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default organizerSlice.reducer;
