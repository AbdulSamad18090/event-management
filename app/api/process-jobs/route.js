import dbConnect from "@/lib/db-connection/DbConnection";
import JobQueue from "@/lib/models/JobQueue";
import Transaction from "@/lib/models/Transaction";

export async function GET() {
  try {
    await dbConnect();

    // Fetch one pending job
    const job = await JobQueue.findOneAndUpdate(
      { status: "pending" },
      { status: "processing" },
      { new: true }
    );

    if (!job) {
      return new Response("No pending jobs", { status: 200 });
    }

    try {
      // Save transaction to DB
      await Transaction.create(job.data);

      // Mark job as completed
      await JobQueue.findByIdAndUpdate(job._id, { status: "completed" });

      return new Response("Job processed successfully", { status: 200 });
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

      return new Response("Job failed", { status: 500 });
    }
  } catch (error) {
    console.error("Job processing error:", error);
    return new Response("Processing failed", { status: 500 });
  }
}
