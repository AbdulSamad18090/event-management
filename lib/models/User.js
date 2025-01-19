import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    contact: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["organizer", "attendee"],
      default: "attendee",
    },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    isGoogleLogin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists in Mongoose's cache to prevent overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
