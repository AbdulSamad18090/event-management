import React, { useState } from "react";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ForgotPasswordDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]); // OTP state is limited to 5 slots
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };

  // Handle email form submission (sending OTP)
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending OTP request (replace with actual API call)
    setTimeout(() => {
      setStep(2); // Move to OTP input step
      setLoading(false);
      toast({
        title: "OTP Sent!",
        description: "An OTP has been sent to your email. Please check your inbox.",
      });
    }, 1000);
  };

  // Handle OTP form submission (verifying OTP)
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "OTP Verified!",
        description: "You can now reset your password.",
      });
      onClose(); // Close the dialog after OTP verification
    }, 1000);
  };

  // Reset the dialog state when it is closed
  const handleCloseDialog = () => {
    setStep(1); // Reset to step 1 (Email input)
    setEmail(""); // Clear the email
    setOtp(["", "", "", "", ""]); // Clear OTP fields
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-6">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Please follow the steps to reset your password.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form className="flex flex-col space-y-4" onSubmit={handleSubmitEmail}>
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
                {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmitOtp}>
            <h2 className="text-lg font-semibold mb-4">Enter the OTP sent to your email</h2>
            <InputOTP maxLength={5} className="mb-4">
              <InputOTPGroup>
                {otp.map((value, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="text-center"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex justify-end w-full">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}

        {/* Close Dialog Button */}
        <DialogClose asChild>
          <Button
            variant="secondary"
            onClick={handleCloseDialog} // Reset state and close dialog
            className="mt-4"
          >
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
