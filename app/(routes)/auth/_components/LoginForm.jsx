"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react"; // Ensure correct import from next-auth

const LoginForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Update formData state dynamically
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Form Submitted:", formData);

    const result = await signIn("login", {
      redirect: false, // Prevent automatic redirection
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      console.error("Login Error:", result.error);
      // Optionally display an error message to the user
    } else {
      console.log("Login Success:", result);
      // Redirect user to a protected page or dashboard
      window.location.href = "/dashboard"; // Example redirect
    }
  };

  return (
    <TabsContent value="login">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <Separator className="my-4" />
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => signIn("google", { redirect: true, callbackUrl: "/dashboard" })}
      >
        <FcGoogle />
        Continue with Google
      </Button>
    </TabsContent>
  );
};

export default LoginForm;
