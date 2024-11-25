"use client";

import { useState } from "react";
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

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 pt-5">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Image
            src={"/images/logoimage.png"}
            alt="logo"
            width={100}
            height={100}
          />
          <CardTitle className="text-center text-2xl">
            Welcome To <span className="text-red-500">Event Master</span>
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
              className="text-red-500 cursor-pointer hover:underline"
            >
              {activeTab === "login" ? "Register here" : "Login here"}
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
