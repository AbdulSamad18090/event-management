import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-muted/0 text-rose-600 py-12">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-6">
          Create or discover events that match your interests.
        </p>
        <Link href={"/auth"}>
          <Button>Get Started Now</Button>
        </Link>
      </div>
    </section>
  );
}
