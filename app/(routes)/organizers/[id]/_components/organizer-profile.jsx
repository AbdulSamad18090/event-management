"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import AOS from "aos";
import { getInitials } from "../../utils";
import { useSelector } from "react-redux";
export default function OrganizerProfile({
  organizer,
  organizedEvents,
  totalAttendees,
}) {
  const { reviews } = useSelector((state) => state.review);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (reviews?.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      setAverageRating(totalRating / reviews?.length);
    } else {
      setAverageRating(0); // Default to 0 if no reviews
    }
  }, [reviews]);

  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  return (
    <Card className="mb-6" data-aos="fade-up" data-aos-delay={100}>
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={organizer?.image} alt="Organizer" />
            <AvatarFallback>{getInitials(organizer?.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{organizer?.name}</h1>
            <Badge variant="secondary">Organizer</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {organizer?.bio || "No bio available"}
        </p>
        <div className="flex gap-4 text-sm">
          <div>
            <strong className="block">
              {organizedEvents > 50 ? "50+" : organizedEvents}
            </strong>
            Events Organized
          </div>
          <div>
            <strong className="block">{averageRating}</strong>
            Average Rating
          </div>
          <div>
            <strong className="block">{totalAttendees}</strong>
            Attendees Served
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
