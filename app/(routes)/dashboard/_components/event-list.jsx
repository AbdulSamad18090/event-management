import {
  ArrowRight,
  CalendarDays,
  CalendarIcon,
  MapPin,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EventList({ events, className }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const dateObj = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          You have {events.length} events scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {events.map((event) => (
            <div
              key={event._id}
              className="flex bg-card p-4 rounded-lg border border-border"
            >
              <div className="space-y-1">
                <p className="text-base font-medium leading-none mb-3">{event.name}</p>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70 " />
                  <Badge variant="outline" className="font-normal">
                    {formatTimestamp(event?.date?.from)}
                  </Badge>
                  <ArrowRight size={15} />
                  <Badge className="font-normal">
                    {formatTimestamp(event?.date?.to)}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    {event?.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    {event?.attendees?.length} attendees
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
