import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ForgotPasswordDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Please enter your email to reset your password.
          </DialogDescription>
        </DialogHeader>
        {/* Add your form for resetting password here */}
        <DialogClose asChild>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
