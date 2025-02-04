import dbConnect from "@/lib/db-connection/DbConnection";
import RatingReview from "@/lib/models/RatingReview";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const reviews = await RatingReview.find({ organizerId: id });
    if (reviews.length <= 0) {
      return NextResponse.json({
        message: "No reviews found for this organizer",
      });
    }
    return NextResponse.json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching reviews",
      error: error.message,
    });
  }
}
