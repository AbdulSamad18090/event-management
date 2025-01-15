"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function TimeRangePicker({ onStartTimeChange, onEndTimeChange }) {
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const timeOptions = React.useMemo(() => {
    const times = [];
    for (let i = 1; i <= 12; i++) {
      for (let j = 0; j < 60; j += 30) {
        const minute = j.toString().padStart(2, "0");
        times.push(`${i}:${minute} AM`);
      }
    }
    for (let i = 1; i <= 12; i++) {
      for (let j = 0; j < 60; j += 30) {
        const minute = j.toString().padStart(2, "0");
        times.push(`${i}:${minute} PM`);
      }
    }
    return times;
  }, []);

  const convertTo24Hour = (time12h) => {
    const [time, period] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (hours === 12) {
      hours = period === "AM" ? 0 : 12;
    } else if (period === "PM") {
      hours += 12;
    }

    return hours * 60 + minutes;
  };

  const isTimeBeforeStart = React.useCallback(
    (time) => {
      const startMinutes = convertTo24Hour(startTime);
      const timeMinutes = convertTo24Hour(time);
      return timeMinutes < startMinutes;
    },
    [startTime]
  );

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    onStartTimeChange?.(time);

    // If end time is before new start time, update it
    if (isTimeBeforeStart(endTime)) {
      setEndTime(time);
      onEndTimeChange?.(time);
    }
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    onEndTimeChange?.(time);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Select value={startTime} onValueChange={handleStartTimeChange}>
              <SelectTrigger id="start-time">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent className='h-60'>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Select value={endTime} onValueChange={handleEndTimeChange}>
              <SelectTrigger id="end-time">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent className='h-60'>
                {timeOptions.map((time) => (
                  <SelectItem
                    key={time}
                    value={time}
                    disabled={isTimeBeforeStart(time)}
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
