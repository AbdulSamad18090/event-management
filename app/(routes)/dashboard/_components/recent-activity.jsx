import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recentActivities = [
  {
    id: "1",
    description: "New ticket purchased for Tech Conference 2024",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    description: "Updated venue details for Music Festival",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    description: "Added new speaker to Food & Wine Expo",
    timestamp: "1 day ago",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates on your events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Activity className="mr-4 h-4 w-4 opacity-70" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
