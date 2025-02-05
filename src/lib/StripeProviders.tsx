"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
// console.log("process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const StripeProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        // clientSecret: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        mode: "setup",
        currency: "usd",
        paymentMethodTypes: ["card"],
        appearance: {
          theme: "stripe",
        },
      }}
    >
      {children}
    </Elements>
  );
};

export default StripeProviders;
