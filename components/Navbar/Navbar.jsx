import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../ModeToggler";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white dark:bg-neutral-950 shadow-sm dark:shadow-neutral-900 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Image src={'/images/logo.png'} width={50} height={50}/>
            <Link href="/" className="font-bold text-xl text-primary">
              EventMaster
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="/events"
              className="text-base font-medium text-neutral-500 hover:text-red-500"
            >
              Events
            </Link>
            <Link
              href="/organizers"
              className="text-base font-medium text-neutral-500 hover:text-red-500"
            >
              Organizers
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-neutral-500 hover:text-red-500"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <Button>Get Started</Button>
          </div>

          <div className="md:hidden flex items-center ">
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-2xl text-red-500">
                    EventMaster
                  </SheetTitle>
                  <SheetDescription>
                    <div className=" flex flex-col items-start">
                      <Link
                        href="/events"
                        className="text-left font-medium p-2 rounded-lg hover:bg-red-200 dark:hover:bg-primary/10 w-full"
                      >
                        Events
                      </Link>
                      <Link
                        href="/organizers"
                        className="text-left font-medium p-2 rounded-lg hover:bg-red-200 dark:hover:bg-primary/10 w-full"
                      >
                        Organizers
                      </Link>
                      <Link
                        href="/about"
                        className="text-left font-medium p-2 rounded-lg hover:bg-red-200 dark:hover:bg-primary/10 w-full"
                      >
                        About
                      </Link>
                      <div className="flex items-center gap-2 my-4 w-full">
                        <Button className="w-full">Get Started</Button>
                        <ModeToggle />
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
