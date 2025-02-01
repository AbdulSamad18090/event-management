import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ForgotPasswordDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState([]); // OTP state is limited to 5 slots
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [timer, setTimer] = useState(600); // 10 minutes (600 seconds)
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID for clearing
  const [resOTP, setResOTP] = useState("");

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle OTP input change
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  // Handle new password change
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Start the timer
  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(id); // Stop the timer when it reaches zero
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000); // Update every second
    setIntervalId(id);
  };

  // Handle email form submission (sending OTP)
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResOTP(data.otp);
        setStep(2); // Move to OTP input step
        startTimer(); // Start the 10-minute countdown timer
        toast({
          title: "OTP Sent!",
          description:
            "An OTP has been sent to your email. Please check your inbox.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong. Please try again.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP form submission (verifying OTP)
  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    // Join the otp array to create a single string
    const enteredOtp = otp.toString();

    if (resOTP === enteredOtp) {
      setStep(3);
      toast({
        title: "OTP Verified!",
        description: "You can now set a new password.",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        status: "error",
      });
    }
  };

  // Handle new password form submission
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Successful!",
          description: "Your password has been successfully updated.",
        });
        onClose(); // Close the dialog
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset password.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset the dialog state when it is closed
  const handleCloseDialog = () => {
    setStep(1); // Reset to step 1 (Email input)
    setEmail(""); // Clear the email
    setOtp(["", "", "", "", ""]); // Clear OTP fields
    setNewPassword(""); // Clear new password field
    setTimer(600); // Reset timer
    if (intervalId) {
      clearInterval(intervalId); // Clear the timer interval
    }
    setLoading(false);
    onClose(); // Close the dialog
  };

  // Format the timer into minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Stop the timer when the OTP is verified
  useEffect(() => {
    if (timer === 0 && step === 2) {
      toast({
        title: "OTP Expired",
        description: "The OTP has expired. Please request a new one.",
        status: "error",
      });
      setStep(1); // Go back to the email step
    }
  }, [timer, step]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-lg mx-auto p-6">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Please follow the steps to reset your password.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form
            className="flex flex-col space-y-4"
            onSubmit={handleSubmitEmail}
          >
            <div>
              <Label htmlFor="email-for-otp">Email</Label>
              <Input
                id="email-for-otp"
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> please wait...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form
            className="flex flex-col items-center space-y-4"
            onSubmit={handleSubmitOtp}
          >
            <h2 className="text-lg font-semibold mb-4">
              Enter the OTP sent to your email
            </h2>
            <InputOTP maxLength={5} value={otp} onChange={handleOtpChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>

            <div className="text-sm text-gray-600 mt-2">
              OTP Validity: {formatTime(timer)}
            </div>

            <div className="flex justify-end w-full">
              <Button type="submit" size="sm" disabled={loading || timer === 0}>
                {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: New Password Input */}
        {step === 3 && (
          <form
            className="flex flex-col space-y-4"
            onSubmit={handleSubmitNewPassword}
          >
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                className="w-full mt-2"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> please wait...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
