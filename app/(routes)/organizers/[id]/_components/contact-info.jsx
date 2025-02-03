"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
export default function ContactInfo({organizer}) {
  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{organizer?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{organizer?.contact || "N/A"}</span>
        </div>
        {/* <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>123 Event St, San Francisco, CA 94105</span>
        </div> */}
      </CardContent>
    </Card>
  );
}
