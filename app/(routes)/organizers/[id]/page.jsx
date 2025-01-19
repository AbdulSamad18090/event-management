"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizerProfile from "./_components/organizer-profile";
import ContactInfo from "./_components/contact-info";
import SocialMedia from "./_components/social-media";
import AwardsAndCertifications from "./_components/awards-and-certifications";
import EventsList from "./_components/events-list";
import RatingsAndReviews from "./_components/ratings-and-reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchEventsOfOrganizer } from "@/lib/features/eventSlice";
import { useParams } from "next/navigation";
import {
  fetchNoOfAttendeesForOrganizer,
  fetchOrganizer,
  filterEvents,
  formatNumber,
} from "../utils";
import AOS from "aos";

export default function OrganizerDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { events, loading } = useSelector((state) => state.event);
  const [organizer, setOrganizer] = useState(null);
  const [totalAttendees, setTotalAttendees] = useState(0);

  const getOrganizerDetails = async (id) => {
    try {
      const organizer = await fetchOrganizer(id);
      setOrganizer(organizer);
      const noOfAttendees = await fetchNoOfAttendeesForOrganizer(id);
      setTotalAttendees(formatNumber(noOfAttendees));
    } catch (error) {
      console.error("Error fetching organizer details:", error);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  useEffect(() => {
    getOrganizerDetails(id);
    dispatch(fetchEventsOfOrganizer(id));
  }, [dispatch, id]);

  const { pastEvents, upcomingEvents } = filterEvents(events);

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/3">
          <OrganizerProfile
            organizer={organizer}
            organizedEvents={events?.length || 0}
            totalAttendees={totalAttendees}
          />
          <ContactInfo organizer={organizer} />
          <SocialMedia />
          <AwardsAndCertifications />
        </aside>
        <main className="lg:w-2/3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger
                value="upcoming"
                data-aos="fade-down"
                data-aos-delay={300}
              >
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger
                value="past"
                data-aos="fade-down"
                data-aos-delay={400}
              >
                Past Events
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                data-aos="fade-down"
                data-aos-delay={500}
              >
                Ratings & Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <EventsList
                type="upcoming"
                events={upcomingEvents}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="past">
              <EventsList type="past" events={pastEvents} loading={loading} />
            </TabsContent>
            <TabsContent value="reviews">
              <RatingsAndReviews />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
