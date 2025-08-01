"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import type Stripe from "stripe";

type CartLine = {
  description: string;
  quantity: number;
  amount_subtotal: number;
};

export default function SuccessClient() {
  const [status, setStatus] = useState<"loading" | "paid" | "failed">(
    "loading"
  );
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);
  const [lineItems, setLineItems] = useState<CartLine[]>([]);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const { clearCart } = useCartStore();

  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const router = useRouter();

  // Fetch session and line items
  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    // prevent duplicate clearing
    const clearedKey = `cartCleared-${sessionId}`;
    const alreadyCleared = localStorage.getItem(clearedKey);

    async function fetchData() {
      try {
        const res = await fetch("/api/check-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const { session: sess } = await res.json();

        if (sess.payment_status === "paid") {
          setSession(sess);
          setStatus("paid");
          setCustomerEmail(
            sess.customer_email ?? sess.customer_details?.email ?? null
          );

          const itemsRes = await fetch("/api/session-line-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });

          const { line_items } = await itemsRes.json();
          setLineItems(line_items);

          // Clear cart only once per session
          if (!alreadyCleared) {
            clearCart();
            localStorage.setItem(clearedKey, "true");
          }
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    }

    fetchData();
  }, [sessionId, clearCart]);

  // Auto redirect after 10s
  useEffect(() => {
    if (status === "paid") {
      const timer = setTimeout(() => router.push("/"), 10000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh] text-lg text-white font-sans">
        Processing your payment...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-black text-white rounded-2xl shadow-xl text-center space-y-4">
        <XCircle size={48} className="mx-auto text-red-500" />
        <h1 className="text-3xl font-black">Payment Failed</h1>
        <p>Something went wrong. Please try again or contact support.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-xl hover:opacity-80 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-10 bg-black text-white rounded-2xl shadow-xl space-y-6">
      <CheckCircle size={48} className="mx-auto text-green-500" />
      <h1 className="text-3xl font-black text-center">Order Confirmed</h1>
      <p className="text-center">
        Thank you for your purchase—your payment was successful.
      </p>

      {customerEmail && (
        <p className="text-center text-gray-400">
          Receipt sent to <strong>{customerEmail}</strong>.
        </p>
      )}

      <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
        <h2 className="font-black uppercase border-b border-zinc-700 pb-2">
          Order Summary
        </h2>
        {lineItems.map((li) => (
          <div key={li.description} className="flex justify-between">
            <div>
              <p className="font-medium">{li.description}</p>
              <p className="text-sm text-gray-400">Qty: {li.quantity}</p>
            </div>
            <p className="font-black">
              ${((li.amount_subtotal ?? 0) / 100).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="border-t border-zinc-700 pt-3 flex justify-between font-black uppercase">
          <span>Total</span>
          <span>
            $
            {session?.amount_subtotal
              ? (session.amount_subtotal / 100).toFixed(2)
              : "0.00"}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        You&apos;ll be redirected to the homepage in a few seconds.
      </p>

      <button
        onClick={() => router.push("/")}
        className="block mx-auto px-6 py-3 bg-white text-black font-bold uppercase rounded-xl hover:opacity-80 transition"
      >
        Continue Shopping Now
      </button>
    </div>
  );
}
