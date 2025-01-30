"use client";

import { useEffect, useState } from "react";
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
import { fetchOrganizer } from "@/app/(routes)/organizers/utils";
import Link from "next/link";

export function EventCard({
  title,
  date,
  time,
  location,
  description,
  organizer,
}) {
  const [organizerName, setOrganizerName] = useState("Loading...");

  useEffect(() => {
    const getOrganizer = async () => {
      if (!organizer) return;
      try {
        const organizerDetail = await fetchOrganizer(organizer);
        setOrganizerName(organizerDetail?.name || "Unknown Organizer");
      } catch (error) {
        console.error("Failed to fetch organizer:", error);
        setOrganizerName("Unknown Organizer");
      }
    };
    getOrganizer();
  }, [organizer]);

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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold custom-line-clamp-1">
          {title}
        </CardTitle>
        <CardDescription>
          <div className="font-semibold">
            Organized By{" "}
            <Link href={`/organizers/${organizer}`}>
              <Badge variant={"outline"}>{organizerName}</Badge>
            </Link>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <Badge variant="outline" className="font-normal">
              {formatTimestamp(date?.from)}
            </Badge>
            <ArrowRight size={15} />
            <Badge className="font-normal">{formatTimestamp(date?.to)}</Badge>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            <Badge variant="outline" className="font-normal">
              {time?.from || "TBD"}
            </Badge>
            <ArrowRight size={15} />
            <Badge className="font-normal">{time?.to || "TBD"}</Badge>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>{location || "TBD"}</span>
          </div>
        </div>
        <p className="mt-4 text-sm custom-line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Buy Ticket now</Button>
      </CardFooter>
    </Card>
  );
}
