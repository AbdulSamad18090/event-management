"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useEffect } from "react";
import AOS from "aos";

export default function SocialMedia() {
  useEffect(() => {
      AOS.init({
        duration: 500,
      });
    }, []);

  return (
    (<Card className="mb-6" data-aos="fade-right" data-aos-delay={200}>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around">
          <a href="#" className="text-blue-600 hover:text-blue-800">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-pink-600 hover:text-pink-800">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </CardContent>
    </Card>)
  );
}

