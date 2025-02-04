import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchReviews = createAsyncThunk(
  "/api/review/get/[id]",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/review/get/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      return data.reviews;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postReview = createAsyncThunk(
  "/api/review/post",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/review/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error("Failed to post review");
      }
      const data = await response.json();
      return data?.ratingReview;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    addReview(state, action) {
      state.reviews = [...state.reviews, action.payload];
    },
    deleteReview(state, action) {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload
      );
    },
    updateReview(state, action) {
      state.reviews = state.reviews.map((review) =>
        review.id === action.payload.id ? action.payload : review
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = [...state.reviews, action.payload];
      })
      .addCase(postReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addReview, deleteReview, updateReview } = reviewSlice.actions;

export default reviewSlice.reducer;
