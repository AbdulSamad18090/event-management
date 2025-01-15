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

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    onStartTimeChange?.(time);
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
              <SelectContent className="h-60">
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
              <SelectContent className="h-60">
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
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
