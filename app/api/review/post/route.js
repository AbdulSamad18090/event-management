import dbConnect from "@/lib/db-connection/DbConnection";
import RatingReview from "@/lib/models/RatingReview";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect(); // Connect before doing anything

    const { organizerId, attendeeId, attendeeName, rating, review } = await req.json();

    // Validate required fields
    if (!attendeeId || !attendeeName) {
      return NextResponse.json(
        { message: "Please login before submitting your review." },
        { status: 401 }
      );
    }

    if (!organizerId) {
      return NextResponse.json(
        { message: "Organizer ID is required to post a review." },
        { status: 400 }
      );
    }

    if (!rating || !review) {
      return NextResponse.json(
        { message: "Please fill all the required fields." },
        { status: 400 }
      );
    }

    // Ensure rating is an integer between 1-5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    // Ensure review is at least 10 characters long (optional)
    if (review.length < 10) {
      return NextResponse.json(
        { message: "Review must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Save the review
    const ratingReview = new RatingReview({
      organizerId,
      attendeeId,
      attendeeName,
      rating,
      review,
    });
    await ratingReview.save();

    return NextResponse.json(
      {
        message: "Review submitted successfully.",
        ratingReview,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while posting the review.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
