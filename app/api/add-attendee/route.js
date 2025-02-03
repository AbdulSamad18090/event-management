import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const transaction = await JSON.parse(body);
    console.log("Transaction =>", transaction);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while adding attendee to the event.",
        error: error.message, // Include error message for debugging (remove in production)
      },
      { status: 500 }
    );
  }
}
