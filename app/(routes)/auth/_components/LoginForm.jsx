"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isOpenForgotPasswordDialog, setIsOpenForgotPasswordDialog] =
    useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      console.error("Login Error:", result.error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Invalid Email or Password",
      });
    } else {
      console.log("Login Success:", result);
      setLoading(false);
      toast({
        title: "Login successful.",
      });
    }
  };

  return (
    <>
      <TabsContent value="login">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              // type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            <div className="w-full flex justify-end">
              <div
                className="my-2 text-sm text-rose-600 hover:underline cursor-pointer"
                onClick={() => {
                  setIsOpenForgotPasswordDialog(true);
                }}
              >
                Forgot Password
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Please Wait..." : "Login"}
          </Button>
        </form>
      </TabsContent>
      <ForgotPasswordDialog
        isOpen={isOpenForgotPasswordDialog}
        onClose={() => {
          setIsOpenForgotPasswordDialog(false);
        }}
      />
    </>
  );
};

export default LoginForm;
