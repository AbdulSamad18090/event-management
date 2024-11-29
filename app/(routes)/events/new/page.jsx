"use client";
import React, { useState } from "react";
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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      ...(name.includes("pricing")
        ? { pricing: { ...prev.pricing, [name.split(".")[1]]: value } }
        : { [name]: value }),
    }));
  };

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", eventData);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => setStep(1)}
              className={step === 1 ? "font-bold" : ""}
            >
              Event Details
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => step > 1 && setStep(2)}
              className={step === 2 ? "font-bold" : ""}
            >
              Location & Dates
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={step === 3 ? "font-bold" : ""}>
              Pricing
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit} className="space-y-4">
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
                    {eventData.dateRange.from ? (
                      eventData.dateRange.to ? (
                        <>
                          {format(eventData.dateRange.from, "PP")} -{" "}
                          {format(eventData.dateRange.to, "PP")}
                        </>
                      ) : (
                        format(eventData.dateRange.from, "PP")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={eventData.dateRange.from}
                    selected={eventData.dateRange}
                    onSelect={(range) =>
                      setEventData((prev) => ({ ...prev, dateRange: range }))
                    }
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
                disabled={!eventData.location || !eventData.dateRange.from}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <Label htmlFor="pricing.standard">Standard Ticket Price</Label>
              <Input
                type="number"
                id="pricing.standard"
                name="pricing.standard"
                value={eventData.pricing.standard}
                onChange={handleInputChange}
                placeholder="Standard ticket price"
                min="0"
                step="0.01"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="pricing.vip">VIP Ticket Price</Label>
              <Input
                type="number"
                id="pricing.vip"
                name="pricing.vip"
                value={eventData.pricing.vip}
                onChange={handleInputChange}
                placeholder="VIP ticket price"
                min="0"
                step="0.01"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="pricing.general">
                General Admission Ticket Price
              </Label>
              <Input
                type="number"
                id="pricing.general"
                name="pricing.general"
                value={eventData.pricing.general}
                onChange={handleInputChange}
                placeholder="General admission ticket price"
                min="0"
                step="0.01"
                className="mt-2"
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
              <Button
                type="submit"
                disabled={
                  !eventData.pricing.standard ||
                  !eventData.pricing.vip ||
                  !eventData.pricing.general
                }
              >
                Create Event
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateEventPage;
