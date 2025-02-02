import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import EventTicket from "@/components/EventTicket/EventTicket";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req) {
  try {
    let transaction;
    const rawBody = await req.text();

    try {
      // First try to parse it once
      transaction = JSON.parse(rawBody);

      // If it's still a string, parse it again
      if (typeof transaction === "string") {
        transaction = JSON.parse(transaction);
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { message: "Invalid JSON data received" },
        { status: 400 }
      );
    }

    // Debug logs
    console.log("Final transaction object:", transaction);
    console.log("Transaction type:", typeof transaction);
    console.log("Transaction keys:", Object.keys(transaction));
    console.log("Customer email:", transaction.customerEmail);

    if (
      !transaction?.customerEmail ||
      transaction.customerEmail.trim() === ""
    ) {
      console.error(
        "Invalid or missing customer email. Email value:",
        transaction?.customerEmail
      );
      return NextResponse.json(
        { message: "Valid customer email is required." },
        { status: 400 }
      );
    }

    // Await the render function to ensure it resolves to a string
    const emailHtml = await render(<EventTicket transaction={transaction} />);
    console.log("Generated email HTML length:", emailHtml.length);

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP connection is verified");

    const mailOptions = {
      from: {
        name: "Event Ticket System",
        address: process.env.SMTP_USER,
      },
      to: transaction.customerEmail,
      subject: "Your Event Ticket 🎟️",
      html: emailHtml,
      headers: {
        Priority: "high",
      },
    };

    console.log("Attempting to send email to:", transaction.customerEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully. Message ID:", info.messageId);

    return NextResponse.json(
      {
        message: "Ticket sent successfully",
        messageId: info.messageId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      {
        message: "An error occurred while sending ticket.",
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
