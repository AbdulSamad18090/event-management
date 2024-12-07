"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { toast } from "@/hooks/use-toast";

const CreateEventPage = () => {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    dateRange: { from: null, to: null },
    pricing: {
      standard: "",
      vip: "",
      general: "",
    },
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Improved handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "standard" || name === "vip" || name === "general") {
      setEventData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [name]: value,
        },
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Improved date range selection handler
  const handleDateRangeSelect = (range) => {
    // Ensure both from and to are valid dates or null
    const newDateRange = {
      from: range?.from && isValid(range.from) ? range.from : null,
      to: range?.to && isValid(range.to) ? range.to : null,
    };

    setEventData((prev) => ({
      ...prev,
      dateRange: newDateRange,
    }));
  };

  // Validate date range
  const isValidDateRange = () => {
    const { from, to } = eventData.dateRange;
    return from && isValid(from) && (to ? isValid(to) : true);
  };

  // Handle next step navigation with validation
  const handleNextStep = () => {
    if (step === 1) {
      if (!eventData.eventName || !eventData.eventDescription) {
        toast({
          title: "Error",
          description: "Please fill in all required fields for event details.",
        });
        return;
      }
    } else if (step === 2) {
      if (!eventData.location || !isValidDateRange()) {
        toast({
          title: "Error",
          description: "Please provide a valid location and date range.",
        });
        return;
      }
    } else if (step === 3) {
      if (
        !eventData.pricing.standard ||
        !eventData.pricing.vip ||
        !eventData.pricing.general
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required fields for pricing.",
        });
        return;
      }
    }

    // If all validations pass, go to next step
    setStep((prev) => prev + 1);
  };

  // Rest of the code remains the same as in the previous implementation
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: eventData.eventName,
            description: eventData.eventDescription,
            location: eventData.location,
            date: {
              from: eventData.dateRange.from?.toISOString(),
              to: eventData.dateRange.to?.toISOString(),
            },
            pricing: eventData.pricing,
            organizer: session?.user?.id,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Error",
          description:
            data?.message || "Something went wrong, please try again later.",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      router.push("/events/manage");
    } catch (error) {
      console.error("Error during submit:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle session loading state
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
      if (!session || session?.user?.role === "attendee") {
        router.push("/access-denied");
      }
    }
  }, [session, status, router]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  // Access denied check
  if ((session && session?.user.role === "attendee") || !session) {
    return <AccessDenied />;
  }

  // Pricing input helper
  const renderPricingInput = (label, name) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={eventData.pricing[name]}
        onChange={handleInputChange}
        placeholder={`${label} price`}
        min="0"
        step="0.01"
        className="mt-2"
      />
    </div>
  );

  // Render date range display text
  const renderDateRangeText = () => {
    const { from, to } = eventData.dateRange;
    if (!from) return <span>Pick a date range</span>;

    if (from && !to) return format(from, "PP");

    if (from && to) return `${format(from, "PP")} - ${format(to, "PP")}`;

    return <span>Pick a date range</span>;
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <Breadcrumb className="mb-6">
        {/* Breadcrumb remains the same */}
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => setStep(1)}
              className={
                step === 1
                  ? "font-bold text-rose-600 cursor-pointer"
                  : "cursor-pointer"
              }
            >
              Event Details
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => step > 1 && setStep(2)}
              className={
                step === 2
                  ? "font-bold text-rose-600 cursor-pointer"
                  : "cursor-pointer"
              }
            >
              Location & Dates
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage
              className={
                step === 3
                  ? "font-bold text-rose-600 cursor-pointer"
                  : "cursor-pointer"
              }
            >
              Pricing
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Event Details */}
        {step === 1 && (
          <>
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                type="text"
                id="eventName"
                name="eventName"
                value={eventData.eventName}
                onChange={handleInputChange}
                placeholder="Enter event name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea
                id="eventDescription"
                name="eventDescription"
                value={eventData.eventDescription}
                onChange={handleInputChange}
                placeholder="Describe your event"
                className="mt-2"
              />
            </div>
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full"
              disabled={!eventData.eventName || !eventData.eventDescription}
            >
              Next
            </Button>
          </>
        )}

        {/* Step 2: Location & Dates */}
        {step === 2 && (
          <>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Event Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !eventData.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {renderDateRangeText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={eventData.dateRange?.from}
                    selected={eventData.dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!eventData.location || !isValidDateRange()}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <>
            {renderPricingInput("Standard Ticket", "standard")}
            {renderPricingInput("VIP Ticket", "vip")}
            {renderPricingInput("General Admission", "general")}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
              <Button
                type="submit"
                disabled={
                  !eventData.pricing.standard ||
                  !eventData.pricing.vip ||
                  !eventData.pricing.general ||
                  submitting
                }
              >
                {submitting ? (
                  <>
                    <LoaderCircle /> Please wait...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateEventPage;
