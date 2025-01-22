import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Validate ID (optional, depending on your use case)
    if (!id) {
      return NextResponse.json(
        {
          message: "Organizer ID is required.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const events = await Event.find({ organizer: id });

    return NextResponse.json(
      {
        message: "Events fetched successfully.",
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events =>", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching events.",
        error: error.message, // Include error message for debugging (remove in production)
      },
      { status: 500 }
    );
  }
}
