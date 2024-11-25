import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
      <section className="bg-white dark:bg-gray-950 text-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">Create or discover events that match your interests.</p>
          <Button>
            Get Started Now
          </Button>
        </div>
      </section>
    );
  }
  