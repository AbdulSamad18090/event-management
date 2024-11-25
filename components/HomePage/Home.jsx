"use client";
import CTA from "./components/CTA";
import FeaturedEvents from "./components/FeaturedEvents";
import HeroSection from "./components/HeroSection";
import Testimonials from "./components/Testimonials";
import UpcomingEvents from "./components/UpcomingEvents";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedEvents />
      <UpcomingEvents />
      <Testimonials />
      <CTA />
    </>
  );
}
