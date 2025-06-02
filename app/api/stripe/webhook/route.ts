import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed":
      // Handle successful payment
      await handleSuccessfulPayment(session);
      break;
    case "customer.subscription.updated":
      // Handle subscription updates
      await handleSubscriptionUpdate(session);
      break;
    case "customer.subscription.deleted":
      // Handle subscription cancellations
      await handleSubscriptionCancellation(session);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  // Update user's subscription status in database
  console.log("Payment successful:", session);
}

async function handleSubscriptionUpdate(session: any) {
  // Update subscription details in database
  console.log("Subscription updated:", session);
}

async function handleSubscriptionCancellation(session: any) {
  // Handle subscription cancellation in database
  console.log("Subscription cancelled:", session);
}