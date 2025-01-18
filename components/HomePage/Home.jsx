"use client";
import CTA from "./components/CTA";
import DeveloperContact from "./components/DeveloperContact";
import FeaturedEvents from "./components/FeaturedEvents";
import HeroSection from "./components/HeroSection";
import Testimonials from "./components/Testimonials";
import UpcomingEvents from "./components/UpcomingEvents";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FeaturedEvents />
      <UpcomingEvents />
      <Testimonials />
      <CTA />
      <div className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h1
          data-aos="fade-up"
          data-aos-delay={200}
          className="text-4xl lg:text-5xl font-bold text-center mb-8 text-primary "
        >
          Meet the Developer
        </h1>
        <p data-aos="fade-up"
          data-aos-delay={300} className="text-xl text-center text-muted-foreground mb-12 max-w-2xl">
          Get to know the creative mind behind the code. Connect with me to
          discuss your next project or collaboration opportunity.
        </p>
        <DeveloperContact />
      </div>
    </div>
  );
}
