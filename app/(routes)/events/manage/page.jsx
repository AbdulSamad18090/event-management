"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Eye,
  LoaderCircle,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchEventsOfOrganizer } from "@/lib/features/eventSlice";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "@/hooks/use-toast";

const EventManagementPage = () => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);
  const [searchText, setSearchText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // console.log("viewing event =>", viewingEvent);
  // console.log("event =>", events);

  useEffect(() => {
    AOS.init({
      duration: 500, // Animation duration
      once: true, // Animate only once
      // disable: "mobile", // Disable on mobile devices (optional)
    });
  }, []);

  useEffect(() => {
    dispatch(fetchEventsOfOrganizer(session?.user?.id));
  }, [dispatch, session?.user?.id]);

  const getDate = (timestamp) => {
    const date = timestamp.split("T");
    return date[0];
  };

  const handleDeleteEvent = async (id) => {
    try {
      setIsDeleting(true);

      // Dispatch the delete action and await its result
      const res = await dispatch(deleteEvent(id)).unwrap();

      if (res?.deletedEvent) {
        toast({
          title: "Event deleted successfully.",
          status: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to delete event.",
          description: "The event might not exist or was already deleted.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete event.",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditEvent = () => {};

  // Show loading spinner until session is ready
  if (status === "loading") {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  // If session exists but the user role is "attendee", show Access Denied page
  if ((session && session?.user.role === "attendee") || !session) {
    return <AccessDenied />;
  }

  // Close the dialog by setting viewingEvent to null
  const closeDialog = () => {
    setViewingEvent(null);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 flex-wrap w-full">
            <Link href={"/events/new"}>
              <Button>Create New Event</Button>
            </Link>
            <Input
              type="search"
              placeholder="Search your events..."
              className="w-64"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
          {loading ? (
            <div className="w-full h-32 flex justify-center items-center">
              <LoaderCircle size={30} className="animate-spin" />
            </div>
          ) : (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-72">Title</TableHead>
                  <TableHead className="min-w-40">Description</TableHead>
                  <TableHead className="min-w-40">Location</TableHead>
                  <TableHead className="min-w-60">Date</TableHead>
                  <TableHead className="min-w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events
                  .filter((event) =>
                    event.name.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((event, i) => (
                    <TableRow
                      key={event?._id}
                      data-aos="fade-left"
                      data-aos-anchor="#example-anchor"
                      data-aos-offset="500"
                      data-aos-duration={i * 500}
                    >
                      <TableCell>{event?.name}</TableCell>
                      <TableCell>{event?.description}</TableCell>
                      <TableCell>{event?.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="font-normal">
                            {getDate(event?.date?.from)}
                          </Badge>
                          <ArrowRight size={15} />
                          <Badge className="font-normal">
                            {getDate(event?.date?.to)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-0">
                        <Dialog>
                          <DialogTrigger>
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-r-none"
                              onClick={() => setViewingEvent(event)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-6 rounded-lg shadow-lg">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-semibold">
                                {event?.name}
                              </DialogTitle>
                            </DialogHeader>

                            <div>
                              <p>{event?.description}</p>
                            </div>

                            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                              <h2 className="text-xl font-medium flex items-center gap-2">
                                <MapPin className="text-red-600" />
                                <span>{event?.location}</span>
                              </h2>
                              <div className="text-xl font-medium text-neutral-700 flex items-center gap-2">
                                <h2>
                                  <CircleDollarSign className="text-green-600" />
                                </h2>
                                <div className="flex space-x-4">
                                  <Badge className="bg-gray-200 text-neutral-700">
                                    {event?.pricing?.general}
                                  </Badge>
                                  <Badge className="bg-blue-200 text-blue-700">
                                    {event?.pricing?.standard}
                                  </Badge>
                                  <Badge className="bg-purple-200 text-purple-700">
                                    {event?.pricing?.vip}
                                  </Badge>
                                </div>
                              </div>
                              <div className="font-medium text-neutral-700 flex items-center gap-2">
                                <h2 className="font-medium text-neutral-700">
                                  <CalendarDays className="text-blue-600 text-xl" />
                                </h2>
                                <p>
                                  <Badge variant="outline">
                                    {getDate(event?.date?.from)}
                                  </Badge>{" "}
                                  to <Badge>{getDate(event?.date?.to)}</Badge>
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-none border-l-0 border-r-0"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Dialog>
                          <DialogTrigger>
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-l-none"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you shure you cant to delete the event?
                              </DialogTitle>
                              <DialogDescription>
                                This action will delete the event permanently.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button size="sm" variant="secondary">
                                  Close
                                </Button>
                              </DialogClose>
                              <Button
                                size="sm"
                                disabled={isDeleting}
                                onClick={() => {
                                  handleDeleteEvent(event?._id);
                                }}
                              >
                                {isDeleting ? (
                                  <LoaderCircle
                                    className="animate-spin"
                                    size={10}
                                  />
                                ) : null}
                                {isDeleting ? "Deleting..." : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagementPage;
