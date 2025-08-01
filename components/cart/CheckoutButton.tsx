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
        body: JSON.stringify({ items }), // send entire cart items array
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
      className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase rounded-2xl shadow-md px-6 py-3 transition"
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}
