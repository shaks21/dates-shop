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
    
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Webhook received:", event.type);

    if (event.type === "checkout.session.completed") {
      await handleSuccessfulPayment(event);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== 'paid') {
    console.log("Session not paid:", session.id);
    return;
  }

  try {
    let userId: string | null = null;
    let userEmail: string | null = null;

    // Try to find user
    if (session.metadata?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: session.metadata.userId },
      });
      if (user) {
        userId = user.id;
        userEmail = user.email;
        console.log("User found by ID:", userId);
      }
    }

    if (!userId && session.metadata?.userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: session.metadata.userEmail },
      });
      if (user) {
        userId = user.id;
        userEmail = user.email;
        console.log("User found by metadata email:", userEmail);
      }
    }

    if (!userId && session.customer_email) {
      const user = await prisma.user.findUnique({
        where: { email: session.customer_email },
      });
      if (user) {
        userId = user.id;
        userEmail = user.email;
        console.log("User found by customer email:", userEmail);
      }
    }

    // Get session details
    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items.data.price.product'] }
    );

    const lineItems = expandedSession.line_items?.data || [];

    const orderItems = lineItems.map(item => ({
      product: (item.price?.product as Stripe.Product).name,
      quantity: item.quantity || 1,
      price: (item.price?.unit_amount || 0) / 100,
    }));

    const total = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Determine guest email
    const guestEmail = session.customer_email || 
                      session.metadata?.userEmail || 
                      'unknown@guest.com';

    // Create order (with or without user ID)
    const order = await prisma.order.create({
      data: {
        userId: userId || null, // null for guest orders
        guestEmail: userId ? null : guestEmail, // Only set guest email for actual guests
        status: "completed",
        total,
        orderItems: {
          create: orderItems,
        },
        metadata: {
          stripeSessionId: session.id,
          isGuestOrder: !userId,
          customerEmail: userEmail || guestEmail,
        }
      },
      include: {
        orderItems: true,
      },
    });

    if (userId) {
      console.log("Order created for user:", userEmail, "Order ID:", order.id);
    } else {
      console.log("Guest order created:", guestEmail, "Order ID:", order.id);
    }
    
  } catch (error: unknown) {
    console.error("Failed to create order from webhook:", error instanceof Error ? error.message : "Unknown error");
  }
}