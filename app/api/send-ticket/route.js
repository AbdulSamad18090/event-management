import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import EventTicket from "@/components/EventTicket/EventTicket";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // This should be an App Password if using Gmail
  },
  tls: {
    rejectUnauthorized: false // Sometimes needed for testing
  }
});

export async function POST(req) {
  try {
    const transaction = await req.json();
    console.log("Received transaction:", transaction);

    if (!transaction?.customerEmail) {
      console.error("Missing customer email");
      return NextResponse.json(
        { message: "Customer email is required." },
        { status: 400 }
      );
    }

    // Add logging for email HTML
    const emailHtml = render(<EventTicket transaction={transaction} />);
    console.log("Generated email HTML length:", emailHtml.length);

    // Test SMTP connection before sending
    try {
      await transporter.verify();
      console.log("SMTP connection verified");
    } catch (smtpError) {
      console.error("SMTP verification failed:", smtpError);
      throw smtpError;
    }

    // Send email with more detailed options
    const mailOptions = {
      from: {
        name: "Your Event Name", // Add your event name here
        address: process.env.SMTP_USER
      },
      to: transaction.customerEmail,
      subject: "Your Event Ticket 🎟️",
      html: emailHtml,
      headers: {
        'Priority': 'high'
      }
    };

    console.log("Attempting to send email to:", transaction.customerEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json(
      { 
        message: "Ticket sent successfully",
        messageId: info.messageId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while sending ticket.",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}