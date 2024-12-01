"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, LoaderCircle, MapPin, Ticket } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";

// Sample ticket data (replace with your actual data source)
const sampleTickets = [
  {
    id: "1",
    eventName: "Summer Music Festival",
    date: "August 15, 2024",
    venue: "Central Park Amphitheater",
    status: "Active",
    type: "General Admission",
    price: "$85.00",
  },
  {
    id: "2",
    eventName: "Tech Conference 2024",
    date: "September 22, 2024",
    venue: "Convention Center",
    status: "Upcoming",
    type: "VIP Pass",
    price: "$299.00",
  },
  {
    id: "3",
    eventName: "Comedy Night",
    date: "July 10, 2024",
    venue: "Downtown Comedy Club",
    status: "Completed",
    type: "Standard",
    price: "$45.00",
  },
];

const TicketDetailDialog = ({ ticket }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        View Details
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{ticket.eventName}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span>{ticket.date}</span>
        </div>
        <div className="flex items-center gap-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{ticket.venue}</span>
        </div>
        <div className="flex items-center gap-4">
          <Ticket className="h-5 w-5 text-muted-foreground" />
          <span>{ticket.type}</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const EventTicketsPage = () => {
  const [tickets, setTickets] = useState(sampleTickets);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Track loading state

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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "default";
      case "Upcoming":
        return "outline";
      case "Completed":
        return "secondary";
      default:
        return "default";
    }
  };

  // Show loading spinner until session is ready
  if (loading) {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  // If session exists but the user role is "assignee", show Access Denied page
  if ((session && session?.user.role === "organizer") || !session) {
    return <AccessDenied />; // Custom Access Denied page or message
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Event Tickets</span>
            <Button variant="secondary" size="sm">
              Add New Ticket
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.eventName}
                  </TableCell>
                  <TableCell>{ticket.date}</TableCell>
                  <TableCell>{ticket.venue}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.price}</TableCell>
                  <TableCell className="space-x-2">
                    <TicketDetailDialog ticket={ticket} />
                    <Button variant="ghost" size="sm">
                      <Download />
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

export default EventTicketsPage;
