import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";

export default function CTA() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <section className="bg-muted/0 text-rose-600 py-12">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <h2 className="text-4xl font-bold mb-4" data-aos="fade-up">
          Ready to Get Started?
        </h2>
        <p className="text-lg mb-6" data-aos="fade-up">
          Create or discover events that match your interests.
        </p>
        <Link href={"/auth"} data-aos="fade-up" data-aos-delay={300}>
          <Button>Get Started Now</Button>
        </Link>
      </div>
    </section>
  );
}
