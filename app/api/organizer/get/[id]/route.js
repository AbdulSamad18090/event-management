import dbConnect from "@/lib/db-connection/DbConnection";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    // Fetch the organizer by ID and return it as JSON response
    const organizer = await User.findById(id);

    if (!organizer) {
      return NextResponse.json(
        {
          message: "Organizer not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Organizer fetched successfully",
      organizer,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during fetching organizer.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
