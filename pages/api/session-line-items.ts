import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: "Missing sessionId" });
  const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });
  res.status(200).json({ line_items: items.data });
}
