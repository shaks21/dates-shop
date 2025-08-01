import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

interface Item {
  slug: string;
  quantity: number;
}

interface LeanProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
}

type CheckoutResponse = { url: string } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { items }: { items: Item[] } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  await connectToDatabase();

  const origin = req.headers.origin ?? "http://localhost:3000";

  const slugs = items.map((item) => item.slug);

  const products = await Product.find({
    slug: { $in: slugs },
  }).lean<LeanProduct[]>();

  if (products.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) continue;

    const imageUrl = product.image.startsWith("http")
      ? product.image
      : `${origin}/${product.image}`;
    console.log(imageUrl);
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: [imageUrl],
        },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    });
  }

  if (line_items.length === 0) {
    return res.status(400).json({ message: "No valid products found" });
  }

  try {
    // In your checkout API handler
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return res.status(200).json({ url: session.url! });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ message: "Stripe checkout failed" });
  }
}
