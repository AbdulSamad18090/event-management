import dbConnect from "@/lib/db-connection/DbConnection";
import Transaction from "@/lib/models/Transaction";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Parse the request URL to extract query parameters
    const { searchParams } = new URL(req.url);
    const customerEmail = searchParams.get("email");

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Fetch transactions where customerEmail matches
    const transactions = await Transaction.find({ customerEmail });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
