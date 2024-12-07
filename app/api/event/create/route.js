import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";

export async function POST(req) {
  try {
    const { name, description, location, date, pricing, organizer } =
      await req.json(); // Use await for parsing JSON
    await dbConnect();

    // Validate incoming data
    if (!name || !description || !location || !date || !pricing || !organizer) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please fill in all fields.",
        }),
        { status: 400 }
      );
    }

    // Check if an event with the same name and organizer already exists
    const existing = await Event.findOne({ name, organizer });
    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Event with this name already exists.",
        }),
        { status: 400 }
      );
    }

    // Create the event object
    const event = new Event({
      name,
      description,
      location,
      date: {
        from: new Date(date.from), // Ensure it's a valid Date object
        to: new Date(date.to),
      },
      pricing,
      organizer,
    });

    // Save the event to the database
    await event.save();

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Event created successfully.",
        event,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
