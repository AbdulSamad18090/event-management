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

export default function DashboardPage() {
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

  // Show loading spinner until session is ready
  if (loading) {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  // If session exists but the user role is "assignee", show Access Denied page
  if (session && session?.user.role === "attendee") {
    return <AccessDenied />; // Custom Access Denied page or message
  }

  // If user is authorized, show the dashboard
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stats />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <EventList className="col-span-4" />
        <div className="col-span-3 space-y-4">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
