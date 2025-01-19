import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarDays,
  LoaderCircle,
  MapPin,
  Users,
} from "lucide-react";
import { getDate } from "../../utils";
import { useEffect } from "react";
import AOS from "aos";

export default function EventsList({ type, events, loading }) {
  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2
        className="text-2xl font-bold mb-4"
        data-aos="fade-left"
        data-aos-delay={200}
        data-aos-duration={200}
      >
        {type === "upcoming" ? "Upcoming" : "Past"} Events
      </h2>
      {events?.length === 0 && (
        <h1>No {type} events</h1>
      )}
      {events.map((event, i) => (
        <Card
          key={event._id}
          data-aos="fade-left"
          data-aos-delay={i * 300} // Stagger animation
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{event?.name}</span>
              <Badge variant={type === "upcoming" ? "default" : "secondary"}>
                {type === "upcoming" ? "Upcoming" : "Past"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <Badge variant="outline">
                  {getDate(event?.date?.from)}
                </Badge>{" "}
                <ArrowRight />
                <Badge>{getDate(event?.date?.to)}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event?.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event?.attendees.length} attendees
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
