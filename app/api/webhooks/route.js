import dbConnect from "@/lib/db-connection/DbConnection";
import JobQueue from "@/lib/models/JobQueue";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      // Send Immediate Response to Stripe
      const response = new Response("Webhook received", { status: 200 });

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
        return response;
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

      const transactionData = {
        customerEmail: metadata.customerEmail || session.customer_email,
        tickets: formattedTickets,
        eventId: metadata.eventId,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        status: session.payment_status,
      };

      // Save job to MongoDB queue
      await dbConnect();
      await JobQueue.create({ data: transactionData });

      return response;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
