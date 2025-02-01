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
      // ✅ Respond to Stripe IMMEDIATELY
      new Response("Webhook received", { status: 200 });

      await dbConnect(); // Ensure database connection

      const session = event.data.object;
      const metadata = session.metadata;

      let tickets = [];
      try {
        tickets = JSON.parse(metadata.tickets);
      } catch (error) {
        console.error("Error parsing tickets metadata:", error);
      }

      if (!tickets.length || !tickets[0].tickets?.length) {
        console.error("Invalid ticket data:", tickets);
        return;
      }

      const formattedTickets = tickets.flatMap((event) =>
        event.tickets.map((ticket) => ({
          eventId: event.eventId,
          name: event.name,
          type: ticket.type,
          price: ticket.price,
          qty: ticket.qty,
        }))
      );

      // ✅ Run DB Save Operation in Background (No Response Delay)
      Transaction.create({
        customerEmail: metadata.customerEmail || session.customer_email,
        tickets: formattedTickets,
        eventId: metadata.eventId,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        status: session.payment_status,
      })
        .then(() => console.log("Transaction saved successfully"))
        .catch((err) => console.error("Database save error:", err));
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
