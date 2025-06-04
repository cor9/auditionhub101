import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Camera,
  Gamepad2,
  MessageCircle,
  Video,
  Calendar,
  FilmIcon,
  LineChart,
  MailCheck,
  MessageSquarePlus,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 py-24 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
                Simplified Audition Management
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                Helping Child Actors{" "}
                <span className="text-primary">Shine</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                The ultimate audition management platform for child actors and
                their parents. Track auditions, manage contacts, and gain
                valuable insights to boost your child's acting career.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-background"
                >
                  <Link href="/about">Learn more</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Audition Management Dashboard"
                className="aspect-video rounded-xl object-cover border shadow-xl"
                src="public/frontpage.webp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need To Succeed
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Streamline your child's acting career with our comprehensive
                audition management platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={FilmIcon}
              title="Audition Tracking"
              description="Track auditions, callbacks, and bookings in one place. Never miss an important date again."
              iconColor="text-pink-700"
              gradientFrom="from-pink-500/20"
              gradientTo="to-pink-500/5"
            />
            <FeatureCard
              icon={Calendar}
              title="Smart Calendar"
              description="View all auditions, callbacks, and coaching sessions in an intuitive calendar interface."
              iconColor="text-orange-500"
              gradientFrom="from-orange-500/20"
              gradientTo="to-orange-500/5"
            />
            <FeatureCard
              icon={LineChart}
              title="Performance Insights"
              description="Gain valuable insights on audition performance and industry trends with AI-powered analytics."
              iconColor="text-violet-500"
              gradientFrom="from-violet-500/20"
              gradientTo="to-violet-500/5"
            />
            <FeatureCard
              icon={MessageSquarePlus}
              title="Coaching Services"
              description="Book coaching sessions and get professional feedback on self-tapes and audition prep."
              iconColor="text-rose-500"
              gradientFrom="from-rose-500/20"
              gradientTo="to-rose-500/5"
            />
            <FeatureCard
              icon={Receipt}
              title="Expense Tracking"
              description="Keep track of all your acting-related expenses for budgeting and tax purposes."
              iconColor="text-blue-500"
              gradientFrom="from-blue-500/20"
              gradientTo="to-blue-500/5"
            />
            <FeatureCard
              icon={MailCheck}
              title="Email Integration"
              description="Automatically parse and import audition details from casting emails."
              iconColor="text-emerald-500"
              gradientFrom="from-emerald-500/20"
              gradientTo="to-emerald-500/5"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Elevate Your Child's Acting Career?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join Audition Hub 101 today and take the first step towards more
                organized and successful auditions.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up">Get Started Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
  gradientFrom,
  gradientTo,
}: FeatureCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col space-y-4">
        <div
          className={cn(
            "h-12 w-12 rounded-full bg-gradient-to-b p-2",
            gradientFrom,
            gradientTo
          )}
        >
          <Icon className={cn("h-full w-full", iconColor)} />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
