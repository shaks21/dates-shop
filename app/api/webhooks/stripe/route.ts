// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  try {
    const body = await req.text();
    
    // Verify the webhook came from Stripe
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Webhook received:", event.type);

    // Handle successful checkout
    if (event.type === "checkout.session.completed") {
      await handleSuccessfulPayment(event);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) { // Changed from 'any' to 'unknown'
    console.error("Webhook error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  // Only process paid sessions
  if (session.payment_status !== 'paid' || !session.customer_email) {
    console.log("Session not paid or missing email:", session.id);
    return;
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.customer_email },
    });

    if (!user) {
      console.error("User not found for email:", session.customer_email);
      return;
    }

    // Get complete session details with products
    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items.data.price.product'] }
    );

    const lineItems = expandedSession.line_items?.data || [];

    // Prepare order items
    const orderItems = lineItems.map(item => ({
      product: (item.price?.product as Stripe.Product).name,
      quantity: item.quantity || 1,
      price: (item.price?.unit_amount || 0) / 100, // Convert cents to dollars
    }));

    // Calculate total
    const total = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "completed",
        total,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("Order created successfully:", order.id);
    
  } catch (error) {
    console.error("Failed to create order from webhook:", error);
    // In production, you might want to retry or send an alert
  }
}