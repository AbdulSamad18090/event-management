import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import Transaction from "@/lib/models/Transaction";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    // Get all event IDs for the given organizer
    const organizerEvents = await Event.find({ organizer: id }).select("_id");
    
    // Extract event IDs from organizerEvents
    const eventIds = organizerEvents.map(event => event._id);

    // Fetch only the transactions that belong to these event IDs
    const transactions = await Transaction.find({ eventId: { $in: eventIds } });

    // Calculate total revenue
    const totalRevenue = transactions.reduce(
      (total, transaction) => total + transaction.totalAmount,
      0
    );

    return NextResponse.json({
      message: "Revenue calculated successfully",
      totalRevenue,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get revenue",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
