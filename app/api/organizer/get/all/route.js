import dbConnect from "@/lib/db-connection/DbConnection";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Extract query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default to 10 items per page

    // Calculate the starting index for pagination
    const skip = (page - 1) * limit;

    // Fetch organizers with pagination, excluding the password field
    const organizers = await User.find({ role: "organizer" })
      .select("-password") // Exclude the password field
      .skip(skip)
      .limit(limit);

    // Get the total number of organizers
    const totalOrganizers = await User.countDocuments({ role: "organizer" });

    return NextResponse.json({
      message: "Organizers fetched successfully.",
      organizers,
      pagination: {
        total: totalOrganizers,
        page,
        limit,
        totalPages: Math.ceil(totalOrganizers / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during fetching organizers.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
