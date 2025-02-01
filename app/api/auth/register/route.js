import dbConnect from "@/lib/db-connection/DbConnection";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Parse the request body (JSON data)
    const { name, email, password, role } = await req.json();
    console.log({ name: name, email: email, password: password, role: role });

    // Connect to the database
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email }); // Use await here
    if (existingUser) {
      // Return a 400 status with an error message if the user exists
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object and save it to the database
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "attendee", // Default to "attendee" if no role is provided
    });
    await user.save();

    // Return a success response with the created user data
    return NextResponse.json({
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle errors and log them
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
