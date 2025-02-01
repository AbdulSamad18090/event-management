import { NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import Transaction from "@/lib/models/Transaction";
import dbConnect from "@/lib/db-connection/DbConnection";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Set this in .env

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Connect to MongoDB
      //   await mongoose.connect(process.env.MONGODB_URI);
      await dbConnect();

      // Extract ticket info from session metadata (if stored)
      const tickets = session.metadata
        ? JSON.parse(session.metadata.tickets)
        : [];

      // Store transaction in MongoDB
      const transaction = new Transaction({
        stripeSessionId: session.id,
        customerEmail: session.customer_email,
        eventId: session.metadata?.eventId || "unknown",
        tickets,
        totalAmount: session.amount_total / 100, // Convert from cents
        status: "paid",
      });

      await transaction.save();
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
