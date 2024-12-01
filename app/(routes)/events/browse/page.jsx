import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin, Search } from "lucide-react";

export default function BrowseEvents() {
  // This would typically come from a database or API, filtered by location
  const events = [
    {
      id: 1,
      title: "Tech Conference 2023",
      date: "2023-09-15",
      time: "09:00 AM",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      title: "Music Festival",
      date: "2023-10-01",
      time: "12:00 PM",
      location: "Austin, TX",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "2023-08-20",
      time: "11:00 AM",
      location: "New York, NY",
    },
    {
      id: 4,
      title: "Art Gallery Opening",
      date: "2023-09-05",
      time: "07:00 PM",
      location: "Los Angeles, CA",
    },
    {
      id: 5,
      title: "Marathon",
      date: "2023-11-12",
      time: "06:00 AM",
      location: "Chicago, IL",
    },
    {
      id: 6,
      title: "Book Fair",
      date: "2023-09-30",
      time: "10:00 AM",
      location: "Seattle, WA",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Nearby Events</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input placeholder="Search events..." className="w-full" />
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
              <SelectItem value="new-york">New York, NY</SelectItem>
              <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
              <SelectItem value="chicago">Chicago, IL</SelectItem>
              <SelectItem value="austin">Austin, TX</SelectItem>
              <SelectItem value="seattle">Seattle, WA</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="mr-2 h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
