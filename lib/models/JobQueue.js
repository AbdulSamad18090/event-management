import mongoose from "mongoose";

const JobQueueSchema = new mongoose.Schema({
  data: { type: Object, required: true }, // Transaction Data
  status: {
    type: String,
    enum: ["pending", "processing", "failed", "completed"],
    default: "pending",
  },
  retries: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.JobQueue ||
  mongoose.model("JobQueue", JobQueueSchema);
