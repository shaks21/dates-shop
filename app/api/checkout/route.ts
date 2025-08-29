// app/api/checkout/route.ts
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { CartItem } from '@/lib/stores/cartStore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  const { items, userEmail, userId } = await req.json();

  console.log("Checkout request:", { userEmail, userId, itemCount: items.length });

  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ message: "No items provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const origin = req.headers.get("origin") || "http://localhost:3000";

  // Extract slugs from cart items
  const slugs = items.map((item: CartItem) => item.slug);
  
  try {
    // Fetch products from PostgreSQL using Prisma
    const products = await prisma.product.findMany({
      where: {
        slug: {
          in: slugs
        }
      }
    });

    if (!products.length) {
      return new Response(JSON.stringify({ message: "No products found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create line items for Stripe
    const line_items = items
      .map((item: CartItem) => {
        const product = products.find((p) => p.slug === item.slug);
        if (!product) {
          console.warn(`Product not found for slug: ${item.slug}`);
          return null;
        }
        
        return {
          price_data: {
            currency: "usd",
            product_data: { 
              name: product.title, 
              description: product.description,
              images: [product.image.startsWith('/') ? `${origin}${product.image}` : product.image],
              metadata: {
                productId: product.id, // Store PostgreSQL product ID in metadata
              }
            },
            unit_amount: product.price, // Price is already in cents in PostgreSQL
          },
          quantity: item.quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (line_items.length === 0) {
      return new Response(JSON.stringify({ message: "No valid line items" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: userEmail, // Pre-fill email (user can change)
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add your shipping countries
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        userId: userId || '', // Store user ID for reliable matching
        userEmail: userEmail || '', // Store original email as fallback
      },
      allow_promotion_codes: true, // Allow discount codes
    });

    console.log("Stripe session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({ 
        message: "Checkout failed",
        error: err instanceof Error ? err.message : "Unknown error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}