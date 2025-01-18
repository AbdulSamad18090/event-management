"use client";

import { useParams } from "next/navigation";
import React from "react";

const OrganizerDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Organizer Details</h1>
      <p>Organizer ID: {id}</p>
    </div>
  );
};

export default OrganizerDetailPage;
