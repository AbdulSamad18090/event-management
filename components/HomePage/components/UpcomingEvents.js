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
import { useEffect, useState } from "react";

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
  const [eventChunks, setEventChunks] = useState(chunkEvents(events, chunkSize));

  // Adjust chunk size based on screen width
  useEffect(() => {
    const updateChunkSize = () => {
      const screenWidth = window.innerWidth;
      const newChunkSize = screenWidth >= 1024 ? 4 : 2; // 4 for large screens, 2 for small screens
      setChunkSize(newChunkSize);
      setEventChunks(chunkEvents(events, newChunkSize));
    };

    updateChunkSize(); // Set initial chunk size
    window.addEventListener("resize", updateChunkSize);

    return () => {
      window.removeEventListener("resize", updateChunkSize);
    };
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-300 mb-8">
          Upcoming Events
        </h2>

        <Carousel>
          <CarouselContent>
            {eventChunks.map((chunk, index) => (
              <CarouselItem key={index}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                  {chunk.map((event) => (
                    <Card
                      key={event.id}
                      className="bg-neutral-100 dark:bg-neutral-900 flex flex-col border-none justify-between"
                    >
                      <CardHeader className="p-0 bg-neutral-200 rounded-t-xl">
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={600}
                          height={400}
                          className="rounded-t-lg dark:bg-neutral-800"
                        />
                      </CardHeader>
                      <CardContent className="mt-4">
                        <CardTitle className='text-lg md:text-xl'>{event.title}</CardTitle>
                        <p className="text-sm text-neutral-500 mt-2">
                          {event.date}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {event.location}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>

        <div className="flex justify-center mt-10">
          <Button>Browse All Events</Button>
        </div>
      </div>
    </section>
  );
}
