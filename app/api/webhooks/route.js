import dbConnect from "@/lib/db-connection/DbConnection";
import Transaction from "@/lib/models/Transaction";
import Stripe from "stripe";

// Helper function to implement retry logic with exponential backoff
async function retryOperation(operation, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        break;
      }

      await new Promise(resolve => 
        setTimeout(resolve, delay + Math.random() * 1000)
      );
      delay *= 2;
    }
  }

  console.error(`All ${maxRetries} retry attempts failed:`, lastError);
}

async function saveTransaction(transactionData) {
  await dbConnect();
  return Transaction.create(transactionData);
}

// Function to handle background processing
function processInBackground(fn) {
  // Use setImmediate to defer to the next iteration of the event loop
  setImmediate(async () => {
    try {
      await fn();
    } catch (error) {
      console.error('Background process error:', error);
    }
  });
}

export async function POST(req) {
  try {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      // Send immediate response
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

      // Process the transaction save operation in the background
      processInBackground(async () => {
        await retryOperation(() => saveTransaction(transactionData))
          .then(() => {
            console.log("Transaction saved successfully");
          })
          .catch((err) => {
            console.error("All attempts to save transaction failed:", err);
            // Here you might want to send to an error tracking service
            // or add to a queue for manual review
          });
      });

      return response;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}