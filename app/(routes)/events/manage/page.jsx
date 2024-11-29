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
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";

const EventManagementPage = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Building Workshop",
      date: "2024-02-15",
      status: "Planned",
      description: "Annual team building event",
    },
  ]);
  const [editingEvent, setEditingEvent] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Track loading state

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;

    setEvents(
      events.map((event) =>
        event.id === editingEvent.id ? editingEvent : event
      )
    );
    setEditingEvent(null);
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true); // Wait until session is loaded
    } else {
      setLoading(false); // Set loading to false once session is ready
      // if (!session || session?.user.role === "attendee") {
      //   // Redirect users who are not authenticated or have "assignee" role
      //   router.push("/"); // Uncomment this line if you want to redirect
      // }
    }
  }, [session, status, router]);

  // Show loading spinner until session is ready
  if (loading) {
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

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-72">Title</TableHead>
                <TableHead className="min-w-40">Date</TableHead>
                <TableHead className="min-w-40">Status</TableHead>
                <TableHead className="min-w-40">Description</TableHead>
                <TableHead className="min-w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagementPage;
