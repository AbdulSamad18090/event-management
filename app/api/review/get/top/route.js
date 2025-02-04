import dbConnect from "@/lib/db-connection/DbConnection";
import RatingReview from "@/lib/models/RatingReview";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch only reviews where rating > 3
    const reviews = await RatingReview.find({ rating: { $gt: 3 } });

    if (reviews.length === 0) {
      return NextResponse.json(
        { message: "No reviews found with rating greater than 3" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Reviews fetched successfully", reviews },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reviews", error: error.message },
      { status: 500 }
    );
  }
}
