"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react"; // Import session hook
import { toast } from "@/hooks/use-toast";

export default function CheckoutButton({ tickets }) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession(); // Get user session

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      // alert("Please sign in to proceed with the payment.");
      toast({
        title: "Please sign in",
        description: "You need to sign in to proceed with the payment.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets,
          customerEmail: session.user.email, // Pass user email
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout page
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (error) {
      // alert(error.message);
      toast({
        title: "Low Amount",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? "Please wait..." : "Proceed to checkout"}
    </Button>
  );
}
