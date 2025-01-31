"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
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
import { fetchOrganizer, getInitials } from "@/app/(routes)/organizers/utils";
import Link from "next/link";
import { Separator } from "./separator";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { toast } from "@/hooks/use-toast";

export function EventCard({
  eventId,
  title,
  date,
  time,
  location,
  description,
  organizer,
  pricing,
}) {
  const [organizerName, setOrganizerName] = useState("Loading...");
  const [organizerDetails, setOrganizerDetails] = useState(null);
  const [quantities, setQuantities] = useState(
    Object.keys(pricing).reduce(
      (acc, type) => ({
        ...acc,
        [type]: 0,
      }),
      {}
    )
  );

  const dispatch = useDispatch();

  const increment = (type) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const decrement = (type) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ eventId, title, pricing, quantities }));
    toast({
      title: "Ticket Added to Cart",
      description: "You have added the ticket to your cart.",
    });
  };

  useEffect(() => {
    const getOrganizer = async () => {
      if (!organizer) return;
      try {
        const organizerDetail = await fetchOrganizer(organizer);
        setOrganizerDetails(organizerDetail);
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
          <div className="font-semibold flex items-center gap-2">
            Organized By{" "}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge
                  variant={"outline"}
                  className={"cursor-pointer p-1 pr-2"}
                >
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={organizerDetails?.image} />
                    <AvatarFallback>
                      {getInitials(organizerName)}
                    </AvatarFallback>
                  </Avatar>
                  {organizerName}
                </Badge>
              </HoverCardTrigger>
              <Link href={`/organizers/${organizer}`}>
                <HoverCardContent className="w-80 cursor-pointer">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src={organizerDetails?.image} />
                      <AvatarFallback>
                        {getInitials(organizerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{organizerName}</h4>
                      <p className="text-sm line-clamp-2 font-normal">
                        {organizerDetails?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </Link>
            </HoverCard>
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
        <p className="mt-4 text-sm line-clamp-2">{description}</p>
        <Card className="w-full mt-4 p-0">
          <CardContent className="p-2">
            {Object.entries(pricing).map(([type, amount], index) => (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <Badge variant={"secondary"} className="text-sm">
                    {type.toLocaleUpperCase()}
                  </Badge>
                  <span className="font-medium ">Rs.{amount}</span>
                </div>
                {index < Object.entries(pricing).length - 1 && (
                  <Separator className="my-1" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger className="w-full">
            <Button
              className="w-full"
              onClick={() => {
                setQuantities(
                  Object.keys(pricing).reduce(
                    (acc, type) => ({
                      ...acc,
                      [type]: 0,
                    }),
                    {}
                  )
                );
              }}
            >
              Buy Now
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-96 max-w-3xl overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <Badge variant="outline" className="font-normal">
                  {formatTimestamp(date?.from)}
                </Badge>
                <ArrowRight size={15} />
                <Badge className="font-normal">
                  {formatTimestamp(date?.to)}
                </Badge>
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
            <div className="font-semibold flex items-center gap-2">
              Organized By{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge
                    variant={"outline"}
                    className={"cursor-pointer p-1 pr-2"}
                  >
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={organizerDetails?.image} />
                      <AvatarFallback>
                        {getInitials(organizerName)}
                      </AvatarFallback>
                    </Avatar>
                    {organizerName}
                  </Badge>
                </HoverCardTrigger>
                <Link href={`/organizers/${organizer}`}>
                  <HoverCardContent className="w-80 cursor-pointer">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src={organizerDetails?.image} />
                        <AvatarFallback>
                          {getInitials(organizerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          {organizerName}
                        </h4>
                        <p className="text-sm line-clamp-2 font-normal">
                          {organizerDetails?.bio || "No bio available"}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </Link>
              </HoverCard>
            </div>
            <Card className="w-full mt-4 p-0">
              <CardContent className="p-2">
                {Object.entries(pricing).map(([type, amount], index) => (
                  <div key={type}>
                    <div className="grid grid-cols-3 items-center gap-2 w-full px-4 py-2">
                      <Badge variant="secondary" className="text-sm w-fit">
                        {type.toLocaleUpperCase()}
                      </Badge>

                      <span className="font-medium text-center">
                        Rs.{amount}
                      </span>

                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => decrement(type)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">
                          {quantities[type]}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => increment(type)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < Object.entries(pricing).length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAddToCart}>Add To Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
