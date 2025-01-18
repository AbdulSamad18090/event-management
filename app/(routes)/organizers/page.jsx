"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchOrganizers } from "@/lib/features/organizerSlice";
import {
  ArrowRight,
  Link,
  LoaderCircle,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function OrganizersPage() {
  const dispatch = useDispatch();
  const { organizers, pagination, loading } = useSelector(
    (state) => state.organizer
  );
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Default items per page (can be adjusted)
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchOrganizers({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const filteredOrganizers = organizers.filter((organizer) =>
    organizer?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderOrganizerCard = (organizer) => {
    return (
      <Card className="cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={organizer.image} // Fallback image
              alt={organizer.name}
            />
            <AvatarFallback>
              {organizer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{organizer.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{organizer.role}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {organizer.bio || "No bio available."}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header with Search */}
      <div className="flex md:flex-row flex-col items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Organizers</h1>
        <div className="relative w-full max-w-xs">
          <Input
            type="search"
            placeholder="Start writing organizer name..."
            className="pl-10 pr-4 py-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            size={20}
          />
        </div>
      </div>

      {/* Organizer Cards */}
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizers.length <= 0 && (
            <div
              data-aos="fade-up"
              className="w-full my-5 col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center"
            >
              <h1>No Organizers</h1>
            </div>
          )}
          {filteredOrganizers?.map((organizer, i) => (
            <div
              key={organizer._id}
              data-aos="fade-up"
              data-aos-delay={i * 300}
            >
              <Dialog>
                <DialogTrigger asChild>
                  {renderOrganizerCard(organizer)}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] ">
                  <DialogHeader>
                    <DialogTitle>Organizer Details</DialogTitle>
                    <DialogDescription>
                      Detailed information about the organizer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={organizer.image}
                          alt={organizer.name}
                        />
                        <AvatarFallback>
                          {organizer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {organizer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {organizer.role}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Bio</h4>
                      <p className="text-sm">
                        {organizer.bio || "No bio available."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <p className="text-sm">{organizer.email || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <p className="text-sm">{organizer.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="group flex items-center gap-2 transition-all"
                      onClick={() =>
                        router.push(`/organizers/${organizer?._id}`)
                      }
                    >
                      More about {organizer?.name}
                      <ArrowRight className="transform transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="p-4 my-5 flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                disabled={currentPage === pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
