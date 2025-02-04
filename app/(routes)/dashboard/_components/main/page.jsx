"use client";
import { useSession } from "next-auth/react";
import { EventList } from "../event-list";
import { QuickActions } from "../quick-actions";
import { RecentActivity } from "../recent-activity";
import { Stats } from "../stats";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsOfOrganizer } from "@/lib/features/eventSlice";
import {
  fetchNoOfAttendeesForOrganizer,
  filterEvents,
  formatNumber,
} from "@/app/(routes)/organizers/utils";
import { fetchReviews } from "@/lib/features/reviewSlice";
import { getRevenue } from "../../utils";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Track loading state
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.event);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [noOfAttendees, setNoOfAttendees] = useState(0);
  const { reviews } = useSelector((state) => state.review);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchNoOfAttendees = async () => {
    const noOfAttendees = await fetchNoOfAttendeesForOrganizer(
      session?.user?.id
    );
    setNoOfAttendees(formatNumber(noOfAttendees));
  };

  const getTotalRevenue = async () => {
    const rev = await getRevenue(session?.user?.id);
    setTotalRevenue(formatNumber(rev));
  };

  const calculateAvgRating = () => {
    if (reviews?.length > 0) {
      const totalRating = reviews?.reduce(
        (totalRating, review) => totalRating + review?.rating,
        0
      );
      const avgRating = totalRating / reviews.length;
      setAvgRating(avgRating.toFixed(1));
    }
  };

  useEffect(() => {
    dispatch(fetchEventsOfOrganizer(session?.user?.id));
    const { upcomingEvents } = filterEvents(events);
    setUpcomingEvents(upcomingEvents);
    fetchNoOfAttendees();
    dispatch(fetchReviews(session?.user?.id));
    getTotalRevenue();
    calculateAvgRating();
  }, [dispatch, session]);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true); // Wait until session is loaded
    } else {
      setLoading(false);
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

  // If user is authorized, show the dashboard
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stats
          totalEvents={events?.length}
          totalAttendees={noOfAttendees}
          AverageRating={avgRating}
          totalRevenue={totalRevenue}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <EventList events={upcomingEvents} className="col-span-4" />
        <div className="col-span-3 space-y-4">
          <QuickActions id={session?.user?.id} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
