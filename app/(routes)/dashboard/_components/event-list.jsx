import { CalendarDays, MapPin, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const events = [
  {
    id: "1",
    name: "Tech Conference 2024",
    date: "2024-06-15",
    location: "San Francisco, CA",
    attendees: 500,
  },
  {
    id: "2",
    name: "Music Festival",
    date: "2024-07-20",
    location: "Austin, TX",
    attendees: 10000,
  },
  {
    id: "3",
    name: "Food & Wine Expo",
    date: "2024-08-05",
    location: "New York, NY",
    attendees: 2000,
  },
];

export function EventList({ className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          You have {events.length} events scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{event.name}</p>
                <div className="flex items-center pt-2">
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    {event.date}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    {event.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    {event.attendees} attendees
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
