"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "@/lib/features/eventSlice";
import { filterEvents } from "@/app/(routes)/organizers/utils";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EventCard } from "@/components/ui/event-card";
import { Button } from "@/components/ui/button";

// Helper function to chunk events
const chunkEvents = (array, size) => {
  if (!array || array.length === 0) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function UpcomingEvents() {
  const dispatch = useDispatch();
  const { allEvents, loading } = useSelector((state) => state.event);
  const [chunkSize, setChunkSize] = useState(2);
  const [eventChunks, setEventChunks] = useState([]);

  useEffect(() => {
    dispatch(fetchAllEvents({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (allEvents) {
      const { ongoingEvents } = filterEvents(allEvents); // Fix incorrect filtering
      setEventChunks(chunkEvents(ongoingEvents, chunkSize));
    }
  }, [allEvents, chunkSize]);

  // Update chunk size based on screen width
  useEffect(() => {
    const updateChunkSize = () => {
      setChunkSize(window.innerWidth >= 1024 ? 3 : 2);
    };

    updateChunkSize();
    window.addEventListener("resize", updateChunkSize);
    return () => {
      window.removeEventListener("resize", updateChunkSize);
    };
  }, []);

  return (
    <section className="py-16 bg-muted/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-300 mb-8">
          Ongoing Events
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
                    {chunk.map((event) => (
                      <div key={event._id} data-aos="fade-up">
                        <EventCard
                          eventId={event._id}
                          title={event.name}
                          description={event.description}
                          location={event.location}
                          date={event.date}
                          time={event.time}
                          organizer={event.organizer}
                          pricing={event.pricing}
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

        <div className="flex justify-center mt-10">
          <Link href={"/events/browse"}>
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
