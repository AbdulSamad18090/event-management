"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "@/lib/features/eventSlice";
import { EventCard } from "@/components/ui/event-card";
import { LoaderCircle, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import cities from "../../../../lib/pak-cities/pak-cities.json";
import AOS from "aos";

export default function BrowseEvents() {
  const dispatch = useDispatch();
  const { allEvents, loading, pagination } = useSelector(
    (state) => state.event
  );
  const { currentPage, totalEvents, totalPages } = pagination;

  const [limit] = useState(9);
  const [searchCityText, setSearchCityText] = useState("");
  const [searchEventText, setSearchEventText] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDate, setSelectedDate] = useState("any");
  const [filters, setFilters] = useState({
    searchText: "",
    city: "all",
    dateRange: "any",
  });

  useEffect(() => {
    dispatch(
      fetchAllEvents({
        page: currentPage,
        limit,
        ...filters,
      })
    );
  }, [dispatch, currentPage, limit, filters]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchText: searchEventText,
      city: selectedCity,
      dateFilter: selectedDate,
    }));
    // Reset to first page when searching
    dispatch(
      fetchAllEvents({
        page: currentPage,
        limit,
        searchText: searchEventText,
        city: selectedCity,
        dateFilter: selectedDate,
      })
    );
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(
        fetchAllEvents({
          page: currentPage + 1,
          limit,
          ...filters,
        })
      );
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(
        fetchAllEvents({
          page: currentPage - 1,
          limit,
          ...filters,
        })
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Nearby Events</h1>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input
            placeholder="Search events..."
            className="w-full"
            value={searchEventText}
            onChange={(e) => setSearchEventText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="h-64">
              <Input
                placeholder="Search city"
                value={searchCityText}
                onChange={(e) => setSearchCityText(e.target.value)}
              />
              <SelectItem value="all">All Locations</SelectItem>
              {cities
                ?.filter((city) =>
                  city?.name
                    ?.toLowerCase()
                    .includes(searchCityText.toLowerCase())
                )
                ?.map((city, i) => (
                  <SelectItem key={i} value={city?.name.toLowerCase()}>
                    {city?.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents?.map((event, i) => (
            <div key={event?._id} data-aos="fade-up" data-aos-delay={i * 300}>
              <EventCard
                title={event?.name}
                description={event?.description}
                location={event?.location}
                date={event?.date}
                time={event?.time}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Component */}
      <div className="p-4 my-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() =>
                    dispatch(
                      fetchAllEvents({
                        page: i + 1,
                        limit,
                        ...filters,
                      })
                    )
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
