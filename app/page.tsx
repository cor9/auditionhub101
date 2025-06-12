import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  FilmIcon,
  Calendar,
  LineChart,
  MessageSquarePlus,
  Receipt,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  isPopular?: boolean;
  href: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
  gradientFrom,
  gradientTo,
  isPopular = false,
  href,
}: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer block",
        isPopular && "ring-2 ring-primary/50 shadow-lg shadow-primary/20"
      )}
    >
      {isPopular && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Popular
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "h-14 w-14 rounded-xl bg-gradient-to-br p-3 shadow-sm",
              gradientFrom,
              gradientTo,
              "group-hover:scale-110 transition-transform duration-300"
            )}
          >
            <Icon className={cn("h-full w-full", iconColor)} />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Subtle hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-primary/5 py-24 md:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary w-fit">
                <Sparkles className="h-4 w-4" />
                Child Actor 101
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl">
                Helping Child Actors{" "}
                <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  Shine
                </span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                The ultimate audition management platform for child actors and
                their parents. Track auditions, manage contacts, and gain
                valuable insights to boost your child's acting career.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base bg-background/80 backdrop-blur-sm"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-2xl blur-2xl transform rotate-6" />
                <Image
                  alt="Audition Management Dashboard"
                  className="relative aspect-video rounded-2xl object-cover border shadow-2xl"
                  src="/frontpage.webp"
                  width={600}
                  height={337}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything You Need To{" "}
                <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  Succeed
                </span>
              </h2>
              <p className="max-w-[900px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Streamline your child's acting career with our comprehensive
                audition management platform designed by industry professionals.
              </p>
            </div>
          </div>
          
          {/* Feature cards grid with better spacing and layout */}
          <div className="mx-auto max-w-6xl">
            {/* Top row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FeatureCard
                icon={FilmIcon}
                title="Audition Tracking"
                description="Track auditions, callbacks, and bookings in one centralized dashboard. Never miss an important date or opportunity again."
                iconColor="text-pink-700"
                gradientFrom="from-pink-500/20"
                gradientTo="to-pink-700/10"
                isPopular={true}
                href="/auditions"
              />
              <FeatureCard
                icon={Calendar}
                title="Smart Calendar"
                description="Visualize all auditions, callbacks, and coaching sessions in an intuitive calendar interface with automated reminders."
                iconColor="text-orange-500"
                gradientFrom="from-orange-500/20"
                gradientTo="to-orange-600/10"
                href="/calendar"
              />
              <FeatureCard
                icon={LineChart}
                title="Performance Insights"
                description="Gain valuable insights on audition performance and industry trends with AI-powered analytics and reporting."
                iconColor="text-violet-500"
                gradientFrom="from-violet-500/20"
                gradientTo="to-violet-600/10"
                href="/dashboard"
              />
            </div>
            
            {/* Bottom row - 2 cards centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <FeatureCard
                icon={MessageSquarePlus}
                title="Coaching Services"
                description="Book professional coaching sessions and receive expert feedback on self-tapes and audition preparation."
                iconColor="text-rose-500"
                gradientFrom="from-rose-500/20"
                gradientTo="to-rose-600/10"
                href="/services"
              />
              <FeatureCard
                icon={Receipt}
                title="Expense Tracking"
                description="Keep detailed records of all acting-related expenses for budgeting, tax preparation, and financial planning."
                iconColor="text-blue-500"
                gradientFrom="from-blue-500/20"
                gradientTo="to-blue-600/10"
                href="/expenses"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-violet-500/10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Elevate Your Child's{" "}
                <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  Acting Career?
                </span>
              </h2>
              <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Join thousands of families who trust Child Actor 101 to manage their 
                auditions and accelerate their success in the entertainment industry.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg">
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background/80 backdrop-blur-sm">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">Trusted by families nationwide</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Free to start
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  No setup fees
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
