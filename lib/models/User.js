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
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["organizer", "attendee"],
      default: "attendee",
    },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    isGoogleLogin: { type: Boolean, default: false },
    emailNotify: {
      type: Boolean,
      default: true, // Default to receive email notifications
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists in Mongoose's cache to prevent overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
