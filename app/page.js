"use client";

import HomePage from "@/components/HomePage/Home";
import { useSession } from "next-auth/react";
import Script from "next/script";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  // Initialize AOS
  useEffect(() => {
    AOS.init();
  }, []);

  console.log("session: ", session);

  return (
    <>
      <Script
        src="https://unpkg.com/aos@next/dist/aos.js"
        strategy="afterInteractive"
        onLoad={() => {
          AOS.init();
        }}
      />
      <HomePage />
    </>
  );
}
