import dbConnect from "@/lib/db-connection/DbConnection";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const dateFilter = searchParams.get("date");

    // Build query object
    const query = {};
    let dateRange = null;

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(escapeRegex(search), "i") } },
        { description: { $regex: new RegExp(escapeRegex(search), "i") } },
      ];
    }

    // Add city filter
    if (city && city !== "all") {
      query.location = { $regex: new RegExp(escapeRegex(city), "i") };
    }

    // Add date filter based on start date only
    if (dateFilter && dateFilter !== "any") {
      // Get current date in UTC
      const now = new Date();

      // Create UTC start of day
      const startOfDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0
        )
      );

      let startDate, endDate;

      switch (dateFilter) {
        case "today":
          startDate = startOfDay;
          endDate = new Date(startOfDay);
          endDate.setUTCDate(endDate.getUTCDate() + 1);
          break;
        case "tomorrow":
          startDate = new Date(startOfDay);
          startDate.setUTCDate(startDate.getUTCDate() + 1);
          endDate = new Date(startDate);
          endDate.setUTCDate(endDate.getUTCDate() + 1);
          break;
        case "week":
          startDate = startOfDay;
          endDate = new Date(startOfDay);
          endDate.setUTCDate(endDate.getUTCDate() + 7);
          break;
        case "month":
          startDate = startOfDay;
          endDate = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth() + 1, // Move to the next month
              0, // Day 0 gives the last day of the current month
              23,
              59,
              59,
              999 // End of the last day of the current month
            )
          );
          break;
      }

      if (startDate && endDate) {
        query["date.from"] = {
          $gte: startDate,
          $lt: endDate,
        };

        dateRange = {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        };
      }
    }

    // Fetch filtered events with pagination
    const events = await Event.find(query)
      .sort({ "date.from": 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limit);

    return NextResponse.json(
      {
        message: "Events retrieved successfully.",
        events,
        pagination: {
          currentPage: page,
          totalPages,
          totalEvents,
        },
        debug: {
          query,
          dateFilter,
          dateRange: dateFilter !== "any" ? dateRange : null,
          totalEvents,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching events.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// Helper function to sanitize regex input
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
