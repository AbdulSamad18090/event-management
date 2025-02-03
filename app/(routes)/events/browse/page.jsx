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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "../../organizers/[id]/_components/events-list";
import RatingsAndReviews from "../../organizers/[id]/_components/ratings-and-reviews";
import { filterEvents } from "../../organizers/utils";

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

  const currentDate = new Date(); // Get the current date and time

  // const upcomingEvents = allEvents.filter((event) => {
  //   const eventStartDate = new Date(event.date.from);
  //   const eventEndDate = new Date(event.date.to);

  //   // Include events that are either upcoming or ongoing
  //   return (
  //     eventStartDate > currentDate || // Upcoming
  //     (eventStartDate <= currentDate && eventEndDate >= currentDate)
  //   ); // Ongoing
  // });

  const { pastEvents, upcomingEvents, ongoingEvents } = filterEvents(allEvents);

  useEffect(() => {
    dispatch(
      fetchAllEvents({
        page: currentPage,
        limit,
        ...filters,
      })
    );
  }, [dispatch, currentPage, limit, filters]);

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
      <div className="w-full">
        <Tabs
          defaultValue="upcoming"
          className="w-full flex flex-col items-center justify-center"
        >
          <TabsList className="mb-4">
            <TabsTrigger
              className="md:w-[200px]"
              value="ongoing"
              data-aos="fade-down"
              data-aos-delay={200}
            >
              Ongoing Events
            </TabsTrigger>
            <TabsTrigger
              className="md:w-[200px]"
              value="upcoming"
              data-aos="fade-down"
              data-aos-delay={300}
            >
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger
              className="md:w-[200px]"
              value="past"
              data-aos="fade-down"
              data-aos-delay={400}
            >
              Past Events
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ongoing" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingEvents.length > 0 ? (
                ongoingEvents.map((event, i) => (
                  <EventCard
                    key={event._id}
                    eventId={event._id}
                    title={event.name}
                    description={event.description}
                    location={event.location}
                    date={event.date}
                    time={event.time}
                    organizer={event.organizer}
                    pricing={event.pricing}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  />
                ))
              ) : (
                <p className="text-center col-span-3">
                  No ongoing events found.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, i) => (
                  <EventCard
                    key={event._id}
                    eventId={event._id}
                    title={event.name}
                    description={event.description}
                    location={event.location}
                    date={event.date}
                    time={event.time}
                    organizer={event.organizer}
                    pricing={event.pricing}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  />
                ))
              ) : (
                <p className="text-center col-span-3">
                  No upcoming events found.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.length > 0 ? (
                pastEvents.map((event, i) => (
                  <EventCard
                    key={event._id}
                    eventId={event._id}
                    title={event.name}
                    description={event.description}
                    location={event.location}
                    date={event.date}
                    time={event.time}
                    organizer={event.organizer}
                    pricing={event.pricing}
                    isPastEvent={true}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  />
                ))
              ) : (
                <p className="text-center col-span-3">No past events found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Events Grid */}
      {loading && (
        <div className="w-full h-64 flex items-center justify-center">
          <LoaderCircle size={30} className="animate-spin" />
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
