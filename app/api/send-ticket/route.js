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
    rejectUnauthorized: false
  }
});

export async function POST(req) {
  try {
    // Get the raw body text
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse it manually
    const transaction = JSON.parse(rawBody);
    console.log("Parsed transaction:", transaction);

    // Verify the parsed data structure
    console.log("Customer email value:", transaction?.customerEmail);
    console.log("Transaction type:", typeof transaction);
    console.log("Transaction keys:", Object.keys(transaction));

    if (!transaction?.customerEmail || transaction.customerEmail.trim() === '') {
      console.error("Invalid or missing customer email. Email value:", transaction?.customerEmail);
      return NextResponse.json(
        { message: "Valid customer email is required." },
        { status: 400 }
      );
    }

    const emailHtml = render(<EventTicket transaction={transaction} />);
    console.log("Generated email HTML length:", emailHtml.length);

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const mailOptions = {
      from: {
        name: "Event Ticket System",
        address: process.env.SMTP_USER
      },
      to: transaction.customerEmail,
      subject: "Your Event Ticket 🎟️",
      html: emailHtml,
      headers: {
        'Priority': 'high'
      }
    };

    console.log("Sending email to:", transaction.customerEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully. Message ID:", info.messageId);

    return NextResponse.json(
      { 
        message: "Ticket sent successfully",
        messageId: info.messageId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      {
        message: "An error occurred while sending ticket.",
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}