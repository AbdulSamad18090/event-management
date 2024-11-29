import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <XCircle className="h-24 w-24 text-red-500 animate-pulse" />
          <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
            Access Denied
          </h1>
          <p className="mt-4 text-lg">
            Sorry, you don't have permission to access this page.
          </p>
        </div>
        <div className="mt-10">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
        <div className="mt-8">
          <svg
            className="mx-auto h-48 w-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
