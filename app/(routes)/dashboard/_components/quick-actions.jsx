import {
  CalendarPlus,
  Edit,
  MessageCircleMore,
  MessageSquarePlus,
  Settings,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function QuickActions({ id }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Frequently used actions for event management
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Link href={"/events/new"}>
          <Button className="justify-start w-full">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
        <Link href={"/events/manage"}>
          <Button
            className="justify-start border border-border w-full"
            variant="secondary"
          >
            <Edit className="mr-2 h-4 w-4" />
            Manage Events
          </Button>
        </Link>
        <Link href={"/profile"}>
          <Button
            className="justify-start border border-border w-full"
            variant="secondary"
          >
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
        </Link>
        <Link href={`/organizers/${id}`}>
          <Button
            className="justify-start border border-border w-full"
            variant="secondary"
          >
            <MessageCircleMore className="mr-2 h-4 w-4" />
            See Your Reviews
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
