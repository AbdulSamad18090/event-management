import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params; // Destructure `id` from `params`
    await dbConnect(); // Establish database connection

    // Fetch the events organized by the given organizer ID
    const events = await Event.find({ organizer: id }, "attendees");

    // Extract all attendee IDs from the events
    const attendeeIds = events
      .flatMap(event => event.attendees) // Flatten the attendees arrays
      .filter(Boolean); // Ensure no undefined or null IDs

    // Find the count of users with role="attendee" and IDs in the attendeeIds array
    const attendeesCount = await User.countDocuments({
      _id: { $in: attendeeIds },
      role: "attendee",
    });

    // Return the count as JSON response
    return NextResponse.json(
      {
        message: "Attendees count fetched successfully.",
        attendeesCount,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle and return errors
    return NextResponse.json(
      {
        message: "An error occurred during fetching attendees count.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
