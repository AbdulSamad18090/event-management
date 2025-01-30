import dbConnect from "@/lib/db-connection/DbConnection";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    await dbConnect();

    const existing = await User.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: "Organizer not found." },
        { status: 404 }
      );
    }

    if (existing.role !== "organizer") {
      return NextResponse.json(
        { message: "Only organizers can update their information." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, contact, image, bio, emailNotify } = body;

    // Updating the organizer's details
    existing.name = name || existing.name;
    existing.email = email || existing.email;
    existing.contact = contact || existing.contact;
    existing.bio = bio || existing.bio;
    existing.emailNotify = emailNotify;

    if (image) {
      existing.image = image; // Assuming the image URL is processed before sending
    }

    await existing.save();

    return NextResponse.json(
      { message: "Organizer updated successfully.", organizer: existing },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating the organizer.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
