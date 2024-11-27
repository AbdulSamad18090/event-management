"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isOpenForgotPasswordDialog, setIsOpenForgotPasswordDialog] =
    useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <div className="w-full flex justify-end">
              <Button
                variant="link"
                className=" my-0 text-sm"
                onClick={() => {
                  setIsOpenForgotPasswordDialog(true);
                }}
              >
                Forgot Password
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Please Wait..." : "Login"}
          </Button>
        </form>
        {/* <Separator className="my-4" /> */}
        {/* <Button
        variant="secondary"
        className="w-full"
        onClick={() =>
          signIn("google", { redirect: true, callbackUrl: "/dashboard" })
        }
      >
        <FcGoogle />
        Continue with Google
      </Button> */}
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
