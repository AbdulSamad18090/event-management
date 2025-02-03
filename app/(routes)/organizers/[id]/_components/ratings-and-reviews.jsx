"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReviewCard } from "./ReviewCard";
import AOS from "aos";

export default function RatingsAndReviews() {
  // This would typically come from an API call
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "John D.",
      rating: 5,
      comment: "Fantastic organization! The event was flawless.",
    },
    {
      id: 2,
      author: "Sarah M.",
      rating: 4,
      comment:
        "Great experience overall. Minor hiccup with scheduling but quickly resolved.",
    },
    {
      id: 3,
      author: "Alex K.",
      rating: 5,
      comment:
        "Exceeded expectations. Will definitely attend their events again!",
    },
  ]);

  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  return (
    <div className="space-y-4">
      <h2
        className="text-2xl font-bold"
        data-aos="fade-left"
        data-aos-delay={200}
        data-aos-duration={200}
      >
        Ratings & Reviews
      </h2>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Be the first to share your thoughts on Organizer
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 h-[420px] overflow-y-auto overflow-x-hidden">
          {reviews.map((review, i) => (
            <Card
              key={review.id}
              data-aos="fade-left"
              data-aos-delay={i * 300} // Stagger animation
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={review.author}
                    />
                    <AvatarFallback>{review.author[0]}</AvatarFallback>
                  </Avatar>
                  <span>{review.author}</span>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
