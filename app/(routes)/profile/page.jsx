"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Camera, LoaderCircle, Lock, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [avatarSrc, setAvatarSrc] = useState(
    "/placeholder.svg?height=100&width=100"
  );

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth");
    }
  }, [session, status, router]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarSrc(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  function getInitials(name) {
    // Split the name into words and take the first letter of each word, then join them together.
    const initials = name
      .split(" ") // Split by space
      .map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word
      .join(""); // Join the initials together
    return initials;
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings and set email preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={session?.user?.image} />
                    <AvatarFallback>
                      {session && getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleAvatarChange}
                        accept="image/*"
                      />
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={session?.user?.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        disabled="true"
                        placeholder="Enter your email"
                        value={session?.user?.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={session?.user?.bio}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity.
                    </p>
                  </div>
                  <Switch id="emailNotifications" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
