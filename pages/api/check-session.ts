import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).json({ session });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
