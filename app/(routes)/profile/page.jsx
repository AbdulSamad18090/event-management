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
import {
  Bell,
  Camera,
  Cog,
  Dot,
  LoaderCircle,
  Lock,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { Badge } from "@/components/ui/badge";
import { fetchOrganizer } from "../organizers/utils";
import ImageCropper from "./_components/ImageCropper";
import { toast } from "@/hooks/use-toast";

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
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [organizer, setOrganizer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAndSetOrganizer = async () => {
      if (status === "loading") {
        setLoading(true);
      } else {
        setLoading(false);

        try {
          const organizer = await fetchOrganizer(session?.user.id); // Wait for the Promise to resolve
          setOrganizer(organizer);
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
      reader.onload = (e) => {
        setSelectedImage(e.target?.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedAreaPixels) => {
    try {
      setIsUploading(true);
      const croppedImage = await getCroppedImage(
        selectedImage,
        croppedAreaPixels
      );

      const formData = new FormData();
      formData.append("file", croppedImage);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setProfileData((prev) => ({ ...prev, image: data.url }));
        setShowCropper(false);
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error cropping/uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Utility function to crop the image using canvas
  const getCroppedImage = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            resolve(
              new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
            );
          },
          "image/jpeg",
          1
        );
      };

      image.onerror = (error) => reject(error);
    });
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

  const handleSaveChanges = async () => {
    try {
      console.log("Saving profile data: ", profileData);
      setIsSaving(true);
      const response = await fetch(
        `/api/organizer/update/${session?.user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Updated!",
          description: "Profile updated successfully.",
        });
      } else {
        toast({
          title: "Oops!",
          description: "An error occured during updation of your profile.",
        });
      }
    } catch (error) {
      toast({
        title: "Oops!",
        description: "An error occured during updation of your profile.",
      });
    } finally {
      setIsSaving(false);
      setIsEditable(false);
    }
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
              className="cursor-pointer w-20 justify-center hover:scale-110 transition-all hover:shadow-lg"
              onClick={toggleEdit}
            >
              {isEditable ? (
                <span
                  className="flex items-center gap-1"
                  onClick={() => {
                    setProfileData({
                      name: organizer?.name || "",
                      email: organizer?.email || "",
                      contact: organizer?.contact || "",
                      bio: organizer?.bio || "",
                      image: organizer?.image || "",
                      emailNotify: organizer?.emailNotify || false,
                    });
                  }}
                >
                  <X size={15} />
                  Cancel
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Cog size={15} />
                  Edit
                </span>
              )}
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
                  <Avatar className="w-24 h-24 rounded-full">
                    <AvatarImage src={profileData.image} />
                    <AvatarFallback>
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        onChange={handleAvatarChange}
                        accept="image/*"
                        disabled={!isEditable}
                      />
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                    {showCropper && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-background rounded-lg p-6 w-full max-w-md">
                          <ImageCropper
                            image={selectedImage}
                            onCropComplete={handleCropComplete}
                            isUploading={isUploading}
                          />
                        </div>
                      </div>
                    )}
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
                        placeholder="xyz@example.com"
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
            {isSaving ? "Please wait..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
