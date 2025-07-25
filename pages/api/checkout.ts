import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { Product, IProduct } from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

type CheckoutResponse = {
  url: string;
} | {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse>
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { slug } = req.body;
  const origin = req.headers.origin ?? "http://localhost:3000";

  await connectToDatabase();
  const product = await Product.findOne({ slug }).lean<IProduct>();

  if (!product) return res.status(404).json({ message: "Product not found" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            images: [product.image],
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/?success=true`,
    cancel_url: `${origin}/?cancelled=true`,
  });

  res.status(200).json({ url: session.url! }); // Stripe guarantees a URL will exist
}

