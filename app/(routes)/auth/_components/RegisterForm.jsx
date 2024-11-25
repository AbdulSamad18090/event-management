"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";

const RegisterForm = () => {
  const [role, setRole] = useState("attendee");

  return (
    <TabsContent value="register">
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Select Your Role</Label>
          <Select defaultValue={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </TabsContent>
  );
};

export default RegisterForm;
