import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { name, description, location, date, pricing } = await req.json();
    await dbConnect();
    console.log("data ==========>", {name, description, location, date, pricing})

    const existingEvent = await Event.findById(id);

    // Ensure event exists before updating
    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name: name || existingEvent.name,
        description: description || existingEvent.description,
        location: location || existingEvent.location,
        date: date
          ? { from: new Date(date.from), to: new Date(date.to) }
          : { from: existingEvent.date.from, to: existingEvent.date.to },
        pricing: pricing || existingEvent.pricing,
      },
      { new: true }
    ); // `new: true` ensures the updated document is returned
    console.log("Updated Event =======>", updatedEvent)

    return NextResponse.json({
      message: "Event updated successfully.",
      updatedEvent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating the event.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
