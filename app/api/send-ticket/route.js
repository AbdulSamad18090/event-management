import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import EventTicket from "@/components/EventTicket/EventTicket";

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Change to your email provider (e.g., "gmail", "outlook", "smtp")
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASSWORD, // Your email password or app password
  },
});

export async function POST(req) {
  try {
    const transaction = await req.json();

    if (!transaction?.customerEmail) {
      return NextResponse.json(
        { message: "Customer email is required." },
        { status: 400 }
      );
    }

    // Convert React component to HTML
    const emailHtml = render(<EventTicket transaction={transaction} />);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: transaction.customerEmail,
      subject: "Your Event Ticket 🎟️",
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Ticket sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while sending ticket.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
