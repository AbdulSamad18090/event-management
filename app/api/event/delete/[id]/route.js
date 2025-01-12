import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Extract the event ID from the request params
    await dbConnect(); // Connect to the database

    console.log("Deleting event with ID:", id);

    // Find the event by ID and delete it
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        {
          message: `Event with ID ${id} not found.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Event successfully deleted.",
        deletedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while deleting the event.",
        error: error.message, // Include error message for debugging (remove in production)
      },
      { status: 500 }
    );
  }
}
