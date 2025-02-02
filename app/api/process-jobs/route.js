import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connection/DbConnection";
import JobQueue from "@/lib/models/JobQueue";
import Transaction from "@/lib/models/Transaction";

export async function GET(req) {
  // Secure the endpoint using CRON_SECRET
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    // Fetch one pending job
    const job = await JobQueue.findOneAndUpdate(
      { status: "pending" },
      { status: "processing" },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ message: "No pending jobs" }, { status: 200 });
    }

    try {
      // Save transaction to DB
      await Transaction.create(job.data);

      // Mark job as completed
      await JobQueue.findByIdAndUpdate(job._id, { status: "completed" });

      return NextResponse.json({ message: "Job processed successfully" }, { status: 200 });
    } catch (error) {
      console.error("Transaction processing failed:", error);

      // Retry logic
      if (job.retries < 3) {
        await JobQueue.findByIdAndUpdate(job._id, {
          status: "pending",
          $inc: { retries: 1 },
        });
      } else {
        await JobQueue.findByIdAndUpdate(job._id, { status: "failed" });
      }

      return NextResponse.json({ message: "Job failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Job processing error:", error);
    return NextResponse.json({ message: "Processing failed" }, { status: 500 });
  }
}
