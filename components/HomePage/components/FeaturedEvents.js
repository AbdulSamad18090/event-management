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
];

// Helper Function: Split events into chunks of 2
const chunkEvents = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default function FeaturedEvents() {
  const eventChunks = chunkEvents(events, 2); // Split events into chunks of 2

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-300 mb-8">
          Featured Events
        </h2>

        <Carousel>
          <CarouselContent>
            {eventChunks.map((chunk, index) => (
              <CarouselItem key={index}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3">
                  {chunk.map((event, i) => (
                    <div
                      className="flex gap-4 bg-white dark:bg-neutral-900 shadow-md rounded-lg"
                      key={i}
                    >
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={200}
                        height={150}
                        className="rounded-l-lg bg-neutral-200 dark:bg-neutral-800"
                      />
                      <div className="py-2 pr-2 flex flex-col justify-between gap-y-2 w-full">
                        <h1 className="text-xl font-semibold">{event.title}</h1>
                        <div>
                          <p className="text-sm text-neutral-500">
                            {event.date}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {event.location}
                          </p>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                    // <Card key={event.id}>
                    //   <CardHeader>
                    //     <Image
                    //       src={event.image}
                    //       alt={event.title}
                    //       width={600}
                    //       height={400}
                    //       className="rounded-t-lg"
                    //     />
                    //   </CardHeader>
                    //   <CardContent>
                    //     <CardTitle>{event.title}</CardTitle>
                    //     <p className="text-sm text-neutral-500 mt-2">
                    //       {event.date}
                    //     </p>
                    //     <p className="text-sm text-neutral-500">{event.location}</p>
                    //   </CardContent>
                    //   <CardFooter>
                    //     <Button className="w-full">View Details</Button>
                    //   </CardFooter>
                    // </Card>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="flex justify-center mt-10">
          <Button>Browse All Events</Button>
        </div>
      </div>
    </section>
  );
}
