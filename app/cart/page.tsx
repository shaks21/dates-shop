"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCartTotal } from "@/lib/stores/cartStore";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { Minus, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart } = useCartStore();
  const total = useCartTotal();

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (cart.length === 0)
    return (
      <div className="max-w-4xl mx-auto mt-16 text-center text-gray-300 text-xl font-bold uppercase tracking-wide">
        Your cart is empty.
      </div>
    );

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-32 space-y-6 bg-black text-white font-sans min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white text-center">
          Your Cart
        </h1>

        {cart.map((item) => (
          <div
            key={item.slug}
            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3 transition-all hover:bg-zinc-850 duration-200"
          >
            <div className="flex items-center space-x-3 flex-1">
              <Image
                src={`/${item.image}`}
                alt={item.title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg border border-zinc-800"
              />
              <div className="flex-1">
                <Link href={`/products/${item.slug}`}>
                  <h2 className="text-lg font-bold uppercase tracking-tight hover:text-gray-200 transition">
                    {item.title}
                  </h2>
                </Link>
                <p className="text-gray-400 text-xs">
                  ${(item.price / 100).toFixed(2)} each
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => removeFromCart(item.slug, false)}
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-base font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      addToCart({
                        title: item.title,
                        slug: item.slug,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>

                  <button
                    onClick={() => removeFromCart(item.slug, true)}
                    className="ml-4 text-red-500 hover:text-red-600 transition"
                    aria-label="Remove all"
                    title="Remove all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-base font-bold uppercase tracking-wide text-white">
              ${((item.price * item.quantity) / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-900 bg-opacity-98 border-t border-zinc-800 px-4 py-4 flex items-center justify-center z-50">
        <div className="max-w-4xl w-full flex items-center justify-between gap-4">
          <div className="text-lg font-bold uppercase tracking-wider text-white">
            Total: ${total.toFixed(2)}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wide rounded-lg px-4 py-2 transition duration-200"
            >
              Clear Cart
            </button>

            <CheckoutButton
              items={cart.map(({ slug, quantity }) => ({ slug, quantity }))}
            />
          </div>
        </div>
      </footer>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={clearCart}
        title="Clear your cart?"
        description="This will remove all items from your cart."
      />
    </>
  );
}
