import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilmIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <FilmIcon className="h-16 w-16 text-primary" />
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Helping Child Actors <span className="text-primary">Shine</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The ultimate audition management platform for child actors and their parents. 
                  Track auditions, manage contacts, and gain valuable insights.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <FilmIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Audition Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Keep track of all your auditions, callbacks, and bookings in one place.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <FilmIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Calendar</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Never miss an audition with our integrated calendar system.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <FilmIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Performance Analytics</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Gain insights into your child's acting career with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Join AuditionHub today and take your child's acting career to the next level.
              </p>
              <Button asChild size="lg">
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <FilmIcon className="h-6 w-6 text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} AuditionHub. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}