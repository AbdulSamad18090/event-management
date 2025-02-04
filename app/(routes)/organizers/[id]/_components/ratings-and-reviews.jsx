"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReviewCard } from "./ReviewCard";
import AOS from "aos";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "@/lib/features/reviewSlice";

export default function RatingsAndReviews() {
  const { reviews, loading } = useSelector((state) => state.review);

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
      {loading ? (
        <Card>
          <CardContent className="pt-6 ">
            <p className="text-center text-muted-foreground flex items-center gap-2">
              <span>
                <LoaderCircle className="animate-spin text-xl" />
              </span>
              <span>Loading reviews...</span>
            </p>
          </CardContent>
        </Card>
      ) : null}
      {!reviews && !loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Be the first to share your thoughts on Organizer
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 h-[420px] overflow-y-auto overflow-x-hidden">
          {reviews?.map((review, i) => (
            <Card
              key={review._id}
              data-aos="fade-left"
              data-aos-delay={i * 300} // Stagger animation
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={""}
                      alt={review?.attendeeName}
                    />
                    <AvatarFallback>{review?.attendeeName[0]}</AvatarFallback>
                  </Avatar>
                  <span>{review?.attendeeName}</span>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review?.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">{review?.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
