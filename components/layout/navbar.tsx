"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FilmIcon,
  Home,
  LogIn,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Calendar,
  User,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/session-provider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    requiresAuth: true,
  },
  {
    label: "Auditions",
    icon: FilmIcon,
    href: "/auditions",
    color: "text-pink-700",
    requiresAuth: true,
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
    color: "text-orange-500",
    requiresAuth: true,
  },
  {
    label: "Expenses",
    icon: Receipt,
    href: "/expenses",
    color: "text-emerald-500",
    requiresAuth: true,
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const visibleRoutes = routes.filter(route => !route.requiresAuth || user);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/101logo.png" alt="Child Actor 101" width={32} height={32} className="h-8 w-auto" />
            <span className="hidden font-bold sm:inline-block">
              Child Actor 101
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {visibleRoutes.map((route) => (
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
              <SheetTitle className="flex items-center gap-x-2">
                <Image src="/101logo.png" alt="Child Actor 101" width={24} height={24} className="h-6 w-auto" />
                <span className="font-bold">Child Actor 101</span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-4">
              {visibleRoutes.map((route) => (
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
            <div className="flex items-center gap-2">
              {user && (
                <Button variant="outline" className="hidden md:flex" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              )}
              {!loading && (
                user ? (
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/sign-in">
                      Sign In
                      <LogIn className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )
              )}
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}