import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    let transaction;
    const rawBody = await req.text();

    try {
      // First try to parse it once
      transaction = JSON.parse(rawBody);

      // If it's still a string, parse it again
      if (typeof transaction === "string") {
        transaction = JSON.parse(transaction);
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { message: "Invalid JSON data received" },
        { status: 400 }
      );
    }
    // const transaction = await JSON.parse(body);
    const { eventId, customerId, customerEmail, tickets, totalAmount } =
      transaction;
    console.log("Transaction =>", transaction);
    await dbConnect();
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }
    // Ensure attendees array exists
    existingEvent.attendees = existingEvent.attendees || [];
    existingEvent.attendees.push({
      eventId,
      customerId,
      customerEmail,
      tickets,
      totalAmount,
    });

    await existingEvent.save();
    return NextResponse.json(
      { message: "Attendee added successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error =>", error.message);
    return NextResponse.json(
      {
        message: "An error occurred while adding attendee to the event.",
        error: error.message, // Include error message for debugging (remove in production)
      },
      { status: 500 }
    );
  }
}
