"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopReviews } from "@/lib/features/reviewSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircle, Star } from "lucide-react";

export default function Testimonials() {
  const { topReviews, loading } = useSelector((state) => state.review);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopReviews());
  }, [dispatch]);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Allow animations to reset when out of view
      mirror: true, // Animates elements when scrolling back into view
    });
  }, []);

  const testimonials = [
    {
      name: "Alice Johnson",
      feedback:
        "The platform made managing my event so simple! I highly recommend it.",
    },
    {
      name: "David Lee",
      feedback:
        "Buying tickets and staying updated on events has never been easier.",
    },
    {
      name: "Maria Gonzalez",
      feedback:
        "Absolutely fantastic! This platform saved me so much time and effort.",
    },
    {
      name: "John Doe",
      feedback: "A game-changer for event management. Highly impressed!",
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-5">
        <h2
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          className="text-4xl text-neutral-900 dark:text-neutral-300 font-bold text-center mb-8"
        >
          What Our Users Say
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
        {!topReviews && !loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No reviews yet. Be the first to share your thoughts on events.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {topReviews?.map((review, i) => (
              <Card
                key={review._id}
                data-aos={i % 2 !== 1 ? "fade-up-right" : "fade-up-left"}
              data-aos-delay={i * 100}
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={""} alt={review?.attendeeName} />
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
                  <p className="text-muted-foreground italic">
                    {review?.review}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-neutral-950 shadow-md rounded-lg text-center"
              data-aos={index % 2 !== 1 ? "fade-up-right" : "fade-up-left"}
              data-aos-delay={index * 100}
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
            >
              <p className="italic text-neutral-500 mb-4">
                &quot;{testimonial.feedback}&quot;
              </p>
              <h4 className="text-lg font-bold">{testimonial.name}</h4>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
