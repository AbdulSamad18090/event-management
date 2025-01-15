"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AOS from "aos";
import "aos/dist/aos.css";
import { EventCard } from "@/components/ui/event-card";

// Events Data
const events = [
  {
    id: 1,
    title: "Tech Conference 2023",
    date: "August 15-17, 2023",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Music Festival",
    date: "September 1-3, 2023",
    location: "Austin, TX",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    date: "October 5-7, 2023",
    location: "New York, NY",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Startup Meetup",
    date: "November 20, 2023",
    location: "Los Angeles, CA",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Art Exhibition",
    date: "December 10-15, 2023",
    location: "Seattle, WA",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 6,
    title: "Sports Tournament",
    date: "January 5-7, 2024",
    location: "Chicago, IL",
    image: "/placeholder.svg?height=400&width=600",
  },
];

// Helper Function: Split events into chunks
const chunkEvents = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function UpcomingEvents() {
  const [chunkSize, setChunkSize] = useState(2); // Default chunk size for small screens
  const [eventChunks, setEventChunks] = useState(
    chunkEvents(events, chunkSize)
  );

  // Adjust chunk size based on screen width
  useEffect(() => {
    const updateChunkSize = () => {
      const screenWidth = window.innerWidth;
      const newChunkSize = screenWidth >= 1024 ? 3 : 2; // 3 for large screens, 1 for small screens
      setChunkSize(newChunkSize);
      setEventChunks(chunkEvents(events, newChunkSize));
    };

    updateChunkSize(); // Set initial chunk size
    window.addEventListener("resize", updateChunkSize);

    // Initialize AOS when the component mounts
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Animate only once
      disable: "mobile", // Disable on mobile devices (optional)
    });

    return () => {
      window.removeEventListener("resize", updateChunkSize);
    };
  }, []);

  return (
    <section className="py-16 bg-muted/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-300 mb-8"
          data-aos="fade-right" // Animation for section title
        >
          Upcoming Events
        </h2>

        <Carousel>
          <CarouselContent>
            {eventChunks.map((chunk, index) => (
              <CarouselItem key={index}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {chunk.map((event, i) => (
                    <div
                      // className="flex gap-4 bg-white dark:bg-neutral-900 shadow-md rounded-lg"
                      key={i}
                      data-aos="fade-up" // Fade-up animation for each event
                      data-aos-delay={i * 100} // Stagger the animation
                    >
                      <EventCard
                        title={event.title}
                        date={event.date}
                        time="9:00 AM - 4:00 PM"
                        location={event.location}
                        description="Explore the latest advancements in AI and their applications in healthcare with leading experts in the field."
                      />
                    </div>
                    // <div
                    //   key={event.id}
                    //   data-aos="fade-up" // Fade-in animation for each event card
                    //   data-aos-delay={index * 200} // Add a delay to stagger the animations
                    // >
                    //   <Card>
                    //     <CardHeader className="p-0 bg-neutral-200 rounded-t-xl">
                    //       <Image
                    //         src={event.image}
                    //         alt={event.title}
                    //         width={600}
                    //         height={400}
                    //         className="rounded-t-[0.9rem] dark:bg-neutral-800"
                    //       />
                    //     </CardHeader>
                    //     <CardContent className="mt-4">
                    //       <CardTitle className="text-lg md:text-xl">
                    //         {event.title}
                    //       </CardTitle>
                    //       <p className="text-sm text-neutral-500 mt-2">
                    //         {event.date}
                    //       </p>
                    //       <p className="text-sm text-neutral-500">
                    //         {event.location}
                    //       </p>
                    //     </CardContent>
                    //     <CardFooter>
                    //       <Button className="w-full">View Details</Button>
                    //     </CardFooter>
                    //   </Card>
                    // </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div
          className="flex justify-center mt-10"
          data-aos="fade-up" // Fade-in animation for the Browse All Events button
          data-aos-delay="500" // Delay the button animation
        >
          <Button>Browse All Events</Button>
        </div>
      </div>
    </section>
  );
}
