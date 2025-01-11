"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Testimonials() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Allow animations to reset when out of view
      mirror: true, // Animates elements when scrolling back into view
    });
  }, []);

  const testimonials = [
    {
      name: "Alice Johnson",
      feedback:
        "The platform made managing my event so simple! I highly recommend it.",
    },
    {
      name: "David Lee",
      feedback:
        "Buying tickets and staying updated on events has never been easier.",
    },
    {
      name: "Maria Gonzalez",
      feedback:
        "Absolutely fantastic! This platform saved me so much time and effort.",
    },
    {
      name: "John Doe",
      feedback: "A game-changer for event management. Highly impressed!",
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-5">
        <h2
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          className="text-4xl text-neutral-900 dark:text-neutral-300 font-bold text-center mb-8"
        >
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-neutral-950 shadow-md rounded-lg text-center"
              data-aos={index % 2 !== 1 ? "fade-up-right" : "fade-up-left"}
              data-aos-delay={index * 100}
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
            >
              <p className="italic text-neutral-500 mb-4">
                &quot;{testimonial.feedback}&quot;
              </p>
              <h4 className="text-lg font-bold">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
