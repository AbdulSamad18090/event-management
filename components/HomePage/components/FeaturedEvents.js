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
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "@/lib/features/eventSlice";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

// Helper function to chunk events
const chunkEvents = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function UpcomingEvents() {
  const dispatch = useDispatch();
  const { allEvents, loading } = useSelector((state) => state.event);
  const [chunkSize, setChunkSize] = useState(2); // Default chunk size for small screens
  const [eventChunks, setEventChunks] = useState(
    chunkEvents(allEvents, chunkSize)
  );

  useEffect(() => {
    dispatch(fetchAllEvents({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Update chunk size based on screen width
  useEffect(() => {
    const updateChunkSize = () => {
      const screenWidth = window.innerWidth;
      const newChunkSize = screenWidth >= 1024 ? 3 : 2; // 3 for large screens, 2 for small screens
      setChunkSize(newChunkSize);
    };

    updateChunkSize(); // Set initial chunk size
    window.addEventListener("resize", updateChunkSize);

    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      disable: "mobile",
    });

    return () => {
      window.removeEventListener("resize", updateChunkSize);
    };
  }, []);

  useEffect(() => {
    setEventChunks(chunkEvents(allEvents, chunkSize));
  }, [allEvents, chunkSize]);

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-300 mb-8"
          data-aos="fade-right"
        >
          Featured Events
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <LoaderCircle size={30} className="animate-spin" />
          </div>
        ) : (
          <Carousel>
            <CarouselContent>
              {eventChunks.map((chunk, index) => (
                <CarouselItem key={index}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {chunk.map((event, i) => (
                      <div
                        key={event?.id || i} // Ensure unique key
                        data-aos="fade-up"
                        data-aos-delay={i * 100} // Stagger animation
                      >
                        <EventCard
                          key={event?._id}
                          title={event?.name}
                          description={event?.description}
                          location={event?.location}
                          date={event?.date}
                          time={event?.time}
                        />
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <div
          className="flex justify-center mt-10"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <Link href={"/events/browse"}>
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
