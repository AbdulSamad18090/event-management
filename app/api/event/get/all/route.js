import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url); // Extract query parameters
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default to 10 items per page

    // Ensure positive values for page and limit
    const skip = (page - 1) * limit;

    // Fetch events with pagination
    const events = await Event.find()
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get the total count of events for calculating total pages
    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);

    return NextResponse.json(
      {
        message: "Events retrieved successfully.",
        events,
        pagination: {
          currentPage: page,
          totalPages,
          totalEvents,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching events.",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
