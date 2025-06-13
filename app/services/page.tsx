"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Camera,
  Gamepad2,
  MessageCircle,
  Video,
} from "lucide-react";
import { useSession } from "@/components/session-provider";
import { useToast } from "@/hooks/use-toast";

const services = [
  {
    title: "Audition Prep Guide",
    description: "Professional, detailed, and printable PDF audition guide—built to boost your performance.",
    price: 9.99,
    features: [
      "Fill out a simple form",
      "Attach casting sides (PDF)",
      "10-minute turnaround",
      "Customized prep guide",
      "Delivered via email"
    ],
    icon: BookOpen,
    checkoutUrl: "https://www.childactor101.com/prep101",
    color: "text-blue-500",
    gradientFrom: "from-blue-500/20",
    gradientTo: "to-blue-500/5"
  },
  {
    title: "Self Tape Feedback",
    description: "Honest & effective feedback from Coach Corey Ralston within 12 hours.",
    price: 22,
    features: [
      "Detailed performance notes",
      "Correction ideas",
      "Acting method tips",
      "Technical advice",
      "Up to 7 minutes of video"
    ],
    icon: Camera,
    checkoutUrl: "https://www.childactor101.com/home/selftapefeedback",
    color: "text-purple-500",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-purple-500/5"
  },
  {
    title: "Bold Choices Game",
    description: "Make distinctive choices that help you stand out in auditions.",
    price: 0,
    features: [
      "Interactive scene exploration",
      "Develop unique choices",
      "Build confidence",
      "Fun learning experience",
      "Immediate access"
    ],
    icon: Gamepad2,
    checkoutUrl: "https://www.childactor101.com/home/bold-choices",
    color: "text-green-500",
    gradientFrom: "from-green-500/20",
    gradientTo: "to-green-500/5"
  },
  {
    title: "Private Audition Coaching",
    description: "One-on-one Zoom coaching for competitive advantage in auditions.",
    price: 45,
    features: [
      "Strategic choice development",
      "Confidence building",
      "Personalized attention",
      "Professional guidance",
      "25 minute Zoom session"
    ],
    icon: MessageCircle,
    checkoutUrl: "https://www.childactor101.com/home/private-coaching",
    color: "text-rose-500",
    gradientFrom: "from-rose-500/20",
    gradientTo: "to-rose-500/5"
  },
  {
    title: "Parents Guide to Perfect Self Tapes",
    description: "Comprehensive course for creating professional self-tapes that get noticed.",
    price: 49.99,
    features: [
      "Easy navigation",
      "Video lessons",
      "Photo examples",
      "Expert tips",
      "First-hand testimonials"
    ],
    icon: Video,
    checkoutUrl: "https://buy.stripe.com/dR6g0F1XBdrbcGA4iZ",
    color: "text-amber-500",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-amber-500/5"
  }
];

interface ServiceCardProps {
  service: typeof services[0];
}

function ServiceCard({ service }: ServiceCardProps) {
  const { toast } = useToast();

  const handleAccess = () => {
    if (service.price === 0) {
      toast({
        title: "Success!",
        description: "Access granted to Bold Choices Game!",
      });
      // Open the URL in a new tab
      window.open(service.checkoutUrl, '_blank');
    }
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full bg-gradient-to-b p-2 ${service.gradientFrom} ${service.gradientTo}`}
          >
            <service.icon className={`h-6 w-6 ${service.color}`} />
          </div>
          <CardTitle className="text-lg">{service.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="mb-4 text-base leading-relaxed">
          {service.description}
        </CardDescription>
        <ul className="space-y-2 text-sm">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-3xl font-bold text-primary">
          {service.price === 0 ? "FREE" : `$${service.price.toFixed(2)}`}
        </div>
        <Button 
          className="w-full" 
          asChild={service.price > 0}
          onClick={service.price === 0 ? handleAccess : undefined}
        >
          {service.price > 0 ? (
            <Link href={service.checkoutUrl} target="_blank">
              Purchase Now
            </Link>
          ) : (
            "Access Free Game"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ServicesPage() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view services
          </p>
          <Button asChild className="mt-4">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Professional Services</h2>
        <p className="text-muted-foreground text-lg">
          Expert coaching and resources to enhance your child's acting career
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </div>
  );
}
