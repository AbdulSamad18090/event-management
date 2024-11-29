import { CalendarPlus, Edit, MessageSquarePlus, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Frequently used actions for event management
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Button className="justify-start">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
        <Button className="justify-start" variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Event
        </Button>
        <Button className="justify-start" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Attendee
        </Button>
        <Button className="justify-start" variant="outline">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Send Update
        </Button>
      </CardContent>
    </Card>
  );
}
