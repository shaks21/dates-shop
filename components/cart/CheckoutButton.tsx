"use client";

import { useState } from "react";

type CartItem = {
  slug: string;
  quantity: number;
};

type Props = {
  items: CartItem[];
};

export default function CheckoutButton({ items }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-black py-3 p-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-400/50 shadow-lg"
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}
