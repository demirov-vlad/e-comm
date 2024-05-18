import React from "react";
import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "@/app/(customerView)/products/[id]/purchase/_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_KEY as string);

const PurchasePage = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
};

export default PurchasePage;
