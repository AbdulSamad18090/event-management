"use client"
import HomePage from "@/components/HomePage/Home";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  console.log("session: ", session);
  return <HomePage />;
}
