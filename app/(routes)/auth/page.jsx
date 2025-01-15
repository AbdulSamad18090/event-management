"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import RegisterForm from "./_components/RegisterForm";
import LoginForm from "./_components/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { data: session, status } = useSession();
  const router = useRouter();

  // UseEffect to redirect only after a successful login
  useEffect(() => {
    if (status === "authenticated" && session) {
      // Check for role after authentication
      if (session.user?.role === "organizer") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-5">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          {/* <Image
            src={"/images/logoimage.png"}
            alt="logo"
            width={100}
            height={100}
          /> */}
          <CalendarDays
            size={80}
            className="text-orange-500 dark:text-orange-600 mb-4 rotate-6"
          />
          <CardTitle className="text-center text-2xl">
            Welcome To <span className="text-orange-500">Event Master</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            {/* Tabs Navigation */}
            <TabsList className="flex justify-center mb-6">
              <TabsTrigger value="login" className="w-1/2">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="w-1/2">
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <LoginForm />

            {/* Register Tab */}
            <RegisterForm />
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {activeTab === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span
              onClick={() =>
                setActiveTab(activeTab === "login" ? "register" : "login")
              }
              className="text-orange-500 cursor-pointer hover:underline"
            >
              {activeTab === "login" ? "Register here" : "Login here"}
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
