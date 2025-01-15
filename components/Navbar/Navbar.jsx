"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, LoaderCircle, LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../ModeToggler";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { attendeeMenu } from "./menus/attendeeMenu";
import { organizerMenu } from "./menus/organizerMenu";
import { normalMenu } from "./menus/normalMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const { data: session, status } = useSession();

  const menuItems = session
    ? session.user.role === "attendee"
      ? attendeeMenu // If the user is an attendee, use the attendee menu
      : session.user.role === "organizer"
      ? organizerMenu // If the user is an organizer, use the organizer menu
      : normalMenu // Default to normal menu if role is not found
    : normalMenu;

  function getInitials(name) {
    // Split the name into words and take the first letter of each word, then join them together.
    const initials = name
      .split(" ") // Split by space
      .map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word
      .join(""); // Join the initials together
    return initials;
  }

  return (
    <header className="bg-blend-multiply backdrop-blur-md shadow-sm dark:shadow-neutral-900 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            {/* <Image src={"/images/logo.png"} alt="logo" width={50} height={50} /> */}
            <CalendarDays size={30} className="text-orange-500 dark:text-orange-600 rotate-6" />
            <Link href="/" className="font-semibold text-xl text-primary">
              EventMaster
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {status === "loading" ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              menuItems.map((item, i) =>
                item.submenus.length > 0 ? (
                  <NavigationMenu key={i}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid grid-cols-2 w-[400px] gap-3 p-4 ">
                            {item?.submenus.map((submenu, i) => (
                              <Link
                                key={i}
                                href={submenu.url}
                                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-3 rounded-md cursor-pointer"
                              >
                                <NavigationMenuLink>
                                  {submenu.name}
                                </NavigationMenuLink>
                              </Link>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <>
                    <Link
                      key={i}
                      href={item.url}
                      className="hover:text-orange-500 transition-all"
                    >
                      <Button variant="ghost">{item.name}</Button>
                    </Link>
                  </>
                )
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />

            {session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={session?.user.image} />
                      <AvatarFallback className="rounded">
                        {getInitials(session?.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <div className="flex items-center gap-4 rounded-lg cursor-pointer">
                        <Avatar className="h-16 w-16 relative">
                          <AvatarImage src={session?.user.image} />
                          <AvatarFallback className="rounded">
                            {getInitials(session?.user.name)}
                          </AvatarFallback>
                          <ExternalLink
                            size={40}
                            className="absolute top-0 right-0"
                          />
                        </Avatar>

                        <Link href={"/profile"}>
                          <h1 className="text-xl font-">
                            {session?.user.name}
                          </h1>
                          <Badge className={"w-fit rounded"}>
                            {session?.user?.role.toUpperCase()}
                          </Badge>
                        </Link>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}
            {session ? (
              <Button
                variant="icon"
                onClick={() => {
                  signOut({ redirectTo: "/" });
                }}
              >
                <LogOut />
              </Button>
            ) : (
              <Link href={"/auth"}>
                <Button className="w-full">Get Started</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center ">
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col justify-between">
                <SheetHeader>
                  <SheetTitle className="text-2xl text-orange-500 flex items-center gap-2">
                    <Image
                      src={"/images/logo.png"}
                      alt="logo"
                      width={50}
                      height={50}
                    />
                    EventMaster
                  </SheetTitle>
                  <SheetDescription>
                    <div className=" flex flex-col items-start">
                      {status === "loading" ? (
                        <LoaderCircle />
                      ) : (
                        menuItems.map((item, i) =>
                          item.submenus.length > 0 ? (
                            <NavigationMenu key={i}>
                              <NavigationMenuList>
                                <NavigationMenuItem>
                                  <NavigationMenuTrigger>
                                    {item.name}
                                  </NavigationMenuTrigger>
                                  <NavigationMenuContent>
                                    <ul className="grid grid-cols-1 w-[200px] gap-3 p-4 ">
                                      {item?.submenus.map((submenu, i) => (
                                        <Link
                                          key={i}
                                          href={submenu.url}
                                          className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-3 rounded-md cursor-pointer"
                                        >
                                          <NavigationMenuLink>
                                            {submenu.name}
                                          </NavigationMenuLink>
                                        </Link>
                                      ))}
                                    </ul>
                                  </NavigationMenuContent>
                                </NavigationMenuItem>
                              </NavigationMenuList>
                            </NavigationMenu>
                          ) : (
                            <>
                              <Link
                                key={i}
                                href={item.url}
                                className="hover:text-orange-500 transition-all"
                              >
                                <Button variant="ghost">{item.name}</Button>
                              </Link>
                            </>
                          )
                        )
                      )}
                      <div className="flex items-center gap-2 my-4 w-full">
                        <ModeToggle />
                        {session ? (
                          <Button
                            variant="icon"
                            onClick={() => {
                              signOut({ redirectTo: "/" });
                            }}
                          >
                            <LogOut />
                          </Button>
                        ) : (
                          <Link href={"/auth"}>
                            <Button className="w-full">Get Started</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>

                <SheetFooter className={"sm:justify-start"}>
                  <div className="flex items-center justify-between gap-4">
                    {session ? (
                      <div className="flex w-full items-center gap-4 rounded-lg cursor-pointer">
                        <Avatar className="h-16 w-16 relative">
                          <AvatarImage src={session?.user.image} />
                          <AvatarFallback className="rounded">
                            {getInitials(session?.user.name)}
                          </AvatarFallback>
                          <ExternalLink
                            size={20}
                            className="absolute top-0 right-0"
                          />
                        </Avatar>

                        <Link href={"/profile"}>
                          <h1 className="text-xl font-">
                            {session?.user.name}
                          </h1>
                          <Badge className={"w-fit rounded"}>
                            {session?.user?.role.toUpperCase()}
                          </Badge>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
