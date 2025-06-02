"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FilmIcon,
  Home,
  LogIn,
  Menu,
  Receipt,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    color: "text-violet-500",
  },
  {
    label: "Auditions",
    icon: FilmIcon,
    href: "/auditions",
    color: "text-pink-700",
  },
  {
    label: "Expenses",
    icon: Receipt,
    href: "/expenses",
    color: "text-emerald-500",
  },
  {
    label: "Services",
    icon: FilmIcon,
    href: "/services",
    color: "text-orange-500",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <FilmIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Audition Hub 101
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <div className="flex items-center gap-x-2">
                  <route.icon className={cn("h-4 w-4", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Link
                href="/"
                className="flex items-center gap-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FilmIcon className="h-6 w-6 text-primary" />
                <span className="font-bold">Audition Hub 101</span>
              </Link>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="hidden md:flex" asChild>
              <Link href="/sign-in">
                Sign In
                <LogIn className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}