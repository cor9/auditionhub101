import { useState } from 'react';
import { getStripe } from '@/lib/stripe';

interface CheckoutOptions {
  price: number;
  name: string;
  description?: string;
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const checkout = async ({ price, name, description }: CheckoutOptions) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
          name,
          description,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Error in checkout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading };
}