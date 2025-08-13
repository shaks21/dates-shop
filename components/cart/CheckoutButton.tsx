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
      className={`
        relative
        inline-block        
        text-charcoal
        font-serif
        font-semibold
        uppercase
        tracking-widest
        rounded-lg
        px-6
        py-3
        shadow-lg
        transition
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        hover:brightness-110
        focus:outline-none
        focus:ring-4
        focus:ring-amber-300
        focus:ring-opacity-70
      `}
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}
