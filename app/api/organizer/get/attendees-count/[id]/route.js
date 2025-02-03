import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Fetch events organized by the given organizer ID
    const events = await Event.find({
      organizer: id,
    })
      .lean()
      .exec();

    // Count attendees safely
    const attendeesCount = events.reduce((total, event) => {
      const attendeeList = Array.isArray(event.attendees)
        ? event.attendees
        : [];
      return total + attendeeList.length;
    }, 0);

    return NextResponse.json(
      { message: "Attendees count fetched successfully.", attendeesCount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching attendees count.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
