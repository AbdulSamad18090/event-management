import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching event.",
        error: error.message, // Include error message for debugging (remove in production)
      },
      { status: 500 }
    );
  }
}
