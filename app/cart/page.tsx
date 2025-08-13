"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCartTotal } from "@/lib/stores/cartStore";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { Minus, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Image from "next/image";
import Link from "next/link";
import RemoveButtonWithConfirm from "@/components/RemoveButtonWithConfirm";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart } = useCartStore();
  const total = useCartTotal();

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (cart.length === 0)
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center text-amber-700 text-xl font-serif font-semibold uppercase tracking-wide">
        Your cart is empty.
      </div>
    );

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-32 space-y-6 bg-charcoal text-cream font-sans min-h-[calc(100vh-4rem)] rounded-lg shadow-lg">
        <h1
          className="text-3xl md:text-4xl font-serif font-extrabold uppercase tracking-widest text-black mb-8 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Cart
        </h1>

        {cart.map((item) => (
          <div
            key={item.slug}
            className="flex items-center justify-between border border-amber-700 rounded-xl p-4 shadow-inner transition-all duration-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              <Image
                src={`/${item.image}`}
                alt={item.title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg border border-amber-700 shadow-sm"
              />
              <div className="flex-1">
                <Link href={`/products/${item.slug}`}>
                  <h2
                    className="text-lg font-serif font-semibold uppercase tracking-tight hover:text-amber-700 transition"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h2>
                </Link>
                <p className="text-amber-light text-xs font-mono mt-1">
                  ${(item.price / 100).toFixed(2)} each
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => removeFromCart(item.slug, false)}
                    className="p-2 rounded-md bg-amber-400 text-charcoal hover:bg-amber-700 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-lg font-bold font-mono text-black">
                    {item.quantity}
                  </span>
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
                    className="p-2 rounded-md bg-amber-400 text-charcoal hover:bg-amber-700 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>

                  <RemoveButtonWithConfirm
                    itemTitle={item.title}
                    onConfirmRemove={() => removeFromCart(item.slug, true)}
                    className="ml-10 text-red-500 hover:text-red-600 transition"
                  />                  
                </div>
              </div>
            </div>

            <div className="text-lg font-mono font-extrabold uppercase tracking-wide text-black">
              ${((item.price * item.quantity) / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-charcoal bg-opacity-95 border-t border-amber-700 px-6 py-4 flex items-center justify-center z-50 shadow-lg">
        <div className="max-w-4xl w-full flex items-center justify-between gap-6">
          <div
            className="text-xl font-serif font-extrabold uppercase tracking-widest text-black"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Total: ${total.toFixed(2)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setConfirmOpen(true)}
              className="bg-amber-400 text-charcoal font-semibold uppercase tracking-wide rounded-lg px-5 py-2 shadow-md hover:bg-amber-700 transition"
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
