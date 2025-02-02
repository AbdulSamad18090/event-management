import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true },
    eventId: { type: String, required: true },
    customerId: { type: String, required: true },
    tickets: [
      {
        type: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
