import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const organizers = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Event Coordinator",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Logistics Manager",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Carol Williams",
    role: "Marketing Director",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "David Brown",
    role: "Technical Support",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Eva Martinez",
    role: "Volunteer Coordinator",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
];

export default function OrganizersPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Organizers</h1>
        <div className="relative w-full max-w-xs">
          <Input
            type="search"
            placeholder="Start writing organizer name..."
            className="pl-10 pr-4 py-2" // Add padding to make room for the icon
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            size={20}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizers.map((organizer) => (
          <Card key={organizer.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={organizer.avatarUrl} alt={organizer.name} />
                <AvatarFallback>
                  {organizer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{organizer.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {organizer.role}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
