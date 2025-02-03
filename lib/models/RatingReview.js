import mongoose from "mongoose";

const ratingReviewSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendeeName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer value.",
      },
    },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

const RatingReview =
  mongoose.models.RatingReview ||
  mongoose.model("RatingReview", ratingReviewSchema);

export default RatingReview;
