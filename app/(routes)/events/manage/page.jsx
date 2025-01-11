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
import { ArrowRight, Eye, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsOfOrganizer } from "@/lib/features/eventSlice";
import { Badge } from "@/components/ui/badge";

const EventManagementPage = () => {
  const [editingEvent, setEditingEvent] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const { events, loading } = useSelector((state) => state.event);

  console.log("Events =>", events);

  useEffect(() => {
    dispatch(fetchEventsOfOrganizer(session?.user?.id));
  }, [dispatch, session?.user?.id]);

  const getDate = (timestamp) => {
    const date = timestamp.split("T");
    return date[0];
  };

  const handleDeleteEvent = (id) => {};

  const handleEditEvent = () => {};

  // Show loading spinner until session is ready
  if (status === "loading") {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  // If session exists but the user role is "assignee", show Access Denied page
  if ((session && session?.user.role === "attendee") || !session) {
    return <AccessDenied />; // Custom Access Denied page or message
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href={"/events/new"}>
            <Button>Create New Event</Button>
          </Link>
          {
            // Show loading spinner until events are fetched
            loading ? (
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
                    <TableHead className="min-w-40">Date</TableHead>
                    {/* <TableHead className="min-w-40">Status</TableHead> */}
                    <TableHead className="min-w-40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event?._id}>
                      <TableCell>{event?.name}</TableCell>
                      <TableCell>{event?.description}</TableCell>
                      <TableCell>{event?.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="font-normal">{getDate(event?.date?.from)}</Badge>
                          <ArrowRight size={15} />
                          <Badge className="font-normal">{getDate(event?.date?.to)}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-r-none"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-none border-l-0 border-r-0"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-l-none"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagementPage;
