"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";

export default function AwardsAndCertifications() {
  const awards = [
    "Best Event Organizer 2022",
    "Sustainability in Events Award 2021",
    "Customer Satisfaction Excellence 2020",
  ];

  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  return (
    <Card data-aos="fade-right" data-aos-delay={200}>
      <CardHeader>
        <CardTitle>Awards & Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {awards.map((award, index) => (
            <li key={index} className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{award}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
