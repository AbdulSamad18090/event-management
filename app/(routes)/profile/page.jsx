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
import { Bell, Camera, Dot, LoaderCircle, Lock, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { Badge } from "@/components/ui/badge";
import { fetchOrganizer } from "../organizers/utils";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false); // Toggle for enabling/disabling inputs
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    bio: "",
    image: "",
    emailNotify: false,
  });

  useEffect(() => {
    const fetchAndSetOrganizer = async () => {
      if (status === "loading") {
        setLoading(true);
      } else {
        setLoading(false);

        try {
          const organizer = await fetchOrganizer(session?.user.id); // Wait for the Promise to resolve

          setProfileData({
            name: organizer?.name || "",
            email: organizer?.email || "",
            contact: organizer?.contact || "",
            bio: organizer?.bio || "",
            image: organizer?.image || "",
            emailNotify: organizer?.emailNotify || false,
          });
        } catch (error) {
          console.error("Failed to fetch and set organizer data:", error);
        }
      }
    };

    fetchAndSetOrganizer();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  if ((session && session?.user.role === "attendee") || !session) {
    return <AccessDenied />;
  }

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setProfileData((prev) => ({ ...prev, image: e.target?.result }));
      reader.readAsDataURL(file);
    }
  };

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const handleSaveChanges = () => {
    console.log("Saved profile data: ", profileData);
    // Handle API call or further logic here
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <h1>Profile Settings</h1>
            <Dot />
            <Badge
              variant={isEditable ? "outline" : ""}
              className="cursor-pointer w-16 justify-center hover:scale-110 transition-all hover:shadow-lg"
              onClick={toggleEdit}
            >
              {isEditable ? "Cancel" : "Edit"}
            </Badge>
          </CardTitle>
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
                    <AvatarImage src={profileData.image} />
                    <AvatarFallback>
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleAvatarChange}
                        accept="image/*"
                        disabled={!isEditable}
                      />
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        value={profileData.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Phone Number</Label>
                      <Input
                        id="contact"
                        type="text"
                        placeholder="Enter your phone number"
                        value={profileData.contact}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input id="currentPassword" type="password" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input id="newPassword" type="password" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" type="password" disabled />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotify">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity.
                    </p>
                  </div>
                  <Switch
                    id="emailNotify"
                    checked={profileData.emailNotify} // Controlled value
                    onCheckedChange={(checked) => {
                      // Update state when toggled
                      setProfileData((prev) => ({
                        ...prev,
                        emailNotify: checked,
                      }));
                    }}
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSaveChanges} disabled={!isEditable}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
