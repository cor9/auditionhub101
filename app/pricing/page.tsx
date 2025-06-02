"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";

const tiers = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 10 auditions per month",
      "Basic audition tracking",
      "Calendar view",
      "Email notifications",
    ],
  },
  {
    name: "Premium Monthly",
    price: 9.99,
    description: "For serious child actors",
    features: [
      "Unlimited auditions",
      "Advanced analytics",
      "Priority support",
      "Custom insights",
      "Expense tracking",
      "Multiple profiles",
      "Video storage",
    ],
  },
  {
    name: "Premium Annual",
    price: 99.99,
    description: "Best value for committed actors",
    features: [
      "All Premium Monthly features",
      "2 months free",
      "Early access to new features",
      "1-on-1 onboarding call",
      "Priority casting notifications",
    ],
  },
];

export default function PricingPage() {
  const { checkout, isLoading } = useStripeCheckout();

  const handleSubscribe = async (tier: typeof tiers[0]) => {
    if (tier.price === 0) {
      // Handle free tier signup
      return;
    }

    try {
      await checkout({
        price: tier.price,
        name: tier.name,
        description: `${tier.name} Subscription`,
      });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
        <p className="mt-2 text-muted-foreground">
          Choose the perfect plan for your child's acting career
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-3xl font-bold">
                ${tier.price}
                {tier.price > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {tier.name.includes("Annual") ? "/year" : "/month"}
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(tier)}
                disabled={isLoading}
              >
                {tier.price === 0 ? "Get Started" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-lg font-semibold">Money Back Guarantee</h3>
        <p className="mt-2 text-muted-foreground">
          Try any paid plan risk-free for 30 days. If you're not completely satisfied,
          we'll refund your payment. No questions asked.
        </p>
      </div>
    </div>
  );
}