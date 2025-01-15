import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EventCard({ title, date, time, location, description }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="flex items-center mt-2">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>{location}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Register Now</Button>
      </CardFooter>
    </Card>
  );
}
