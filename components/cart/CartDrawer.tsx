"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-96 max-w-full border-l-2 bg-black text-white z-50 shadow-2xl transition-transform transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:text-red-500 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {cart.length === 0 ? (
            <p className="text-sm opacity-70">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.slug}
                className="flex gap-4 items-start border-b border-white/10 pb-4"
              >
                <Image
                  src={`/${item.image}`}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border border-white/10"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <p className="font-semibold text-white hover:underline">
                          {item.title}
                        </p>
                      </Link>
                      <p className="text-sm opacity-60">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.slug, true)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item.slug, item.quantity - 1)
                      }
                      className="px-2 py-1 text-sm bg-white/10 rounded hover:bg-white/20"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.slug, parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center bg-black border border-white/20 rounded text-white"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.slug, item.quantity + 1)
                      }
                      className="px-2 py-1 text-sm bg-white/10 rounded hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-white/10 space-y-4">
            <p className="text-lg font-semibold">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={() => {
                router.push("/cart");
                setIsCartOpen(false);
              }}
              className="w-full bg-white text-black hover:bg-white/90 py-2 rounded-lg font-semibold transition"
            >
              Go to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
