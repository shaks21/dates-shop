"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

type CartItem = {
  slug: string;
  quantity: number;
};

type Props = {
  items: CartItem[];
};

interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

interface Session {
  user: SessionUser;
}

export default function CheckoutButton({ items }: Props) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession() as { data: Session | null };
  
  const handleCheckout = async () => {
    if (!session?.user?.email || !session.user.id) {
      if (confirm("You need to log in to checkout. Would you like to log in now?")) {
        signIn();
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          userEmail: session.user.email,
          userId: session.user.id, // Send user ID for reliable matching
        }),
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
      disabled={loading || items.length === 0 || !session}
      className={`w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-black py-3 p-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-400/50 shadow-lg ${
        !session ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {!session ? "Please Login" : loading ? "Processing..." : "Checkout"}
    </button>
  );
}