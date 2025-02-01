import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { tickets } = await req.json();

    const line_items = tickets.flatMap((event) =>
      event.tickets.map((ticket) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: `${event.name} - ${ticket.type} Ticket`, // Combine event and ticket info
          },
          unit_amount: Math.round(ticket.price * 100), // Convert to cents
        },
        quantity: ticket.qty,
      }))
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        tickets: JSON.stringify(tickets), // Store ticket data
        eventId: tickets[0]?.eventId || "unknown",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
