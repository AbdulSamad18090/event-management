"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react"; // Ensure correct import from next-auth
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react"; // Ensure this is imported

const LoginForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const result = await signIn("credentials", {
      // redirectTo: "/",
      redirect: false, // Prevent automatic redirection
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
      window.location.replace("/dashboard");
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Please Wait..." : "Login"}
        </Button>
      </form>
      <Separator className="my-4" />
      <Button
        variant="secondary"
        className="w-full"
        onClick={() =>
          signIn("google", { redirect: true, callbackUrl: "/dashboard" })
        }
      >
        <FcGoogle />
        Continue with Google
      </Button>
    </TabsContent>
  );
};

export default LoginForm;
