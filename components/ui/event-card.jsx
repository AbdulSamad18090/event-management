import { ArrowRight, CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./badge";

export function EventCard({ title, date, time, location, description }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold custom-line-clamp-1">
          {title}
        </CardTitle>
        <CardDescription className="flex items-center mt-2">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <Badge variant="outline" className="font-normal">
            {formatTimestamp(date?.from)}
          </Badge>
          <ArrowRight size={15} />
          <Badge className="font-normal">{formatTimestamp(date?.to)}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            <Badge variant="outline" className="font-normal">
              {time?.from}
            </Badge>
            <ArrowRight size={15} />
            <Badge className="font-normal">{time?.to}</Badge>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>{location}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 custom-line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
