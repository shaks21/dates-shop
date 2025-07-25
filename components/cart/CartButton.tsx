// components/CartButton.tsx
"use client";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react"; 
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative">
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
            {count}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
