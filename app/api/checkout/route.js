import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { tickets, customerEmail, customerId } = await req.json(); // Ensure customerEmail is received

    if (!customerEmail) {
      return Response.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    if (!customerId) {
      return Response.json(
        { error: "Customer id is required" },
        { status: 400 }
      );
    }

    const line_items = tickets.flatMap((event) =>
      event.tickets.map((ticket) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: `${event.name} - ${ticket.type} Ticket`,
          },
          unit_amount: Math.round(ticket.price * 100),
        },
        quantity: ticket.qty,
      }))
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail, // Attach email
      // customer_id: customerId,
      line_items,
      metadata: {
        tickets: JSON.stringify(tickets),
        eventId: tickets[0]?.eventId || "unknown",
        customerEmail, // Store customer email in metadata
        customerId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
