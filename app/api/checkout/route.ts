import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { CartItem } from '@/lib/stores/cartStore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  const { items } = await req.json();

  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ message: "No items provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await connectToDatabase();

  const origin = req.headers.get("origin") || "http://localhost:3000";

  const slugs = items.map((item: CartItem) => item.slug);

  const products = await Product.find({ slug: { $in: slugs } }).lean();

  if (!products.length) {
    return new Response(JSON.stringify({ message: "No products found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Filter out null values and ensure we only have valid line items
  const line_items = items
    .map((item: CartItem) => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) return null;
      return {
        price_data: {
          currency: "usd",
          product_data: { 
            name: product.title, 
            images: [product.image] 
          },
          unit_amount: Math.round(product.price), 
        },
        quantity: item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Additional check to ensure we have valid line items
  if (line_items.length === 0) {
    return new Response(JSON.stringify({ message: "No valid line items" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Stripe error:", err);
    return new Response(JSON.stringify({ message: "Stripe checkout failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Add other HTTP methods if needed
export async function GET() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}