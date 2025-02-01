import { NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import Transaction from "@/lib/models/Transaction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Received Stripe session:", session);

      const metadata = session.metadata || {};
      const tickets = metadata.tickets ? JSON.parse(metadata.tickets) : [];

      if (!metadata.customerEmail || tickets.length === 0) {
        console.error("Missing required fields in metadata.");
        return NextResponse.json({ error: "Invalid transaction data" }, { status: 400 });
      }

      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI);

      // Store transaction
      const transaction = new Transaction({
        stripeSessionId: session.id,
        customerEmail: metadata.customerEmail, // Now correctly included
        eventId: metadata.eventId || "unknown",
        tickets,
        totalAmount: session.amount_total / 100, // Convert cents to PKR
        status: "paid",
      });

      await transaction.save();
      console.log("Transaction stored successfully!");
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
