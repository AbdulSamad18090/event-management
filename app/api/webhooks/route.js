import dbConnect from "@/lib/db-connection/DbConnection";
import Transaction from "@/lib/models/Transaction";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text(); // Get raw body for Stripe verification

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      await dbConnect(); // Ensure database connection

      const session = event.data.object;
      const metadata = session.metadata;

      let tickets = [];
      try {
        tickets = JSON.parse(metadata.tickets);
      } catch (error) {
        console.error("Error parsing tickets metadata:", error);
      }

      // Ensure tickets array is not empty and contains required fields
      if (!tickets.length || !tickets[0].tickets?.length) {
        console.error("Invalid ticket data:", tickets);
        return new Response("Invalid ticket data", { status: 400 });
      }

      // Flatten tickets array
      const formattedTickets = tickets.flatMap((event) =>
        event.tickets.map((ticket) => ({
          eventId: event.eventId,
          name: event.name,
          type: ticket.type,
          price: ticket.price,
          qty: ticket.qty,
        }))
      );

      // 🛑 Fix: Ensure all required fields exist
      const transaction = new Transaction({
        customerEmail: metadata.customerEmail || session.customer_email, // Get email from metadata or session
        tickets: formattedTickets, // Store parsed tickets
        eventId: metadata.eventId,
        totalAmount: session.amount_total / 100, // Convert cents to PKR
        stripeSessionId: session.id, // Store Stripe session ID
        status: session.payment_status,
      });

      await transaction.save();
      console.log("Transaction saved to MongoDB:", transaction);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
