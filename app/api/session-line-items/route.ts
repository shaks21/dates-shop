import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return Response.json({ message: "Missing sessionId" }, { status: 400 });
    }

    const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });
    
    return Response.json({ line_items: items.data });
    
  } catch (err) {
    console.error("Stripe error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return Response.json({ message: errorMessage }, { status: 500 });
  }
}

// Add other HTTP methods to prevent 405 errors
export async function GET() {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}