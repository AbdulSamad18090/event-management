import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HeroSection() {
  const { data: session } = useSession();
  return (
    <div className="bg-muted/0 flex flex-col items-center text-center py-14 px-4">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
        Welcome to <span className="text-primary">EventMaster</span>
      </h1>
      <p className="max-w-[42rem] leading-normal text-foreground/50 sm:text-xl sm:leading-8 mb-8">
        Create, manage, and discover amazing events all in one place. Join our
        community of event enthusiasts and make your next gathering
        unforgettable.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {(!session || session?.user.role !== "organizer") && (
          <Button asChild size="lg">
            <Link href="/events/browse">Browse Events</Link>
          </Button>
        )}
        {session?.user.role === "organizer" && (
          <>
            <Button asChild size="lg">
              <Link href="/events/manage">Manage Events</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events/new">Create Event</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
