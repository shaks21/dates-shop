"use client";

import { X, Trash2, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useNavStore } from "@/lib/stores/navStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCartTotal } from "@/lib/stores/cartStore";
import ConfirmDialog from "../ui/ConfirmDialog";
import RemoveButtonWithConfirm from "../RemoveButtonWithConfirm";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity } =
    useCartStore();
  const total = useCartTotal();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const toggleMenu = useNavStore((state) => state.toggleMenu);
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useBodyScrollLock(isCartOpen);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:bg-black/40"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-full md:w-1/3 max-w-full z-50 bg-white text-charcoal shadow-2xl border-l-2 border-amber-700/30 transform transition-transform duration-500 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <header className="relative px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-700/20 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase text-black drop-shadow-sm">
              Shopping Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              aria-label="Close cart"
            >
              <X className="w-6 h-6 text-amber-800" />
            </button>
          </div>
          {/* Decorative line */}
          <div className="absolute bottom-0 left-4 md:left-8 right-4 md:right-8 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 space-y-4 w-full max-h-[70vh] scrollbar-thin scrollbar-thumb-amber-700/40 scrollbar-track-transparent">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
              <p className="text-xl font-semibold text-black/80 mb-2">
                Your cart is empty.
              </p>
              <p className="text-sm text-black/60">
                Add items to enjoy a luxurious experience.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.slug}
                className="group flex gap-3 md:gap-4 items-start border-b border-amber-200 last:border-b-0 last:pb-0 transition-all duration-300 hover:shadow-sm hover:bg-amber-50/50 rounded-lg p-2"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.slug}`}
                  onClick={() => {
                    setIsCartOpen(false);
                    toggleMenu(false);
                  }}
                  className="block max-w-[75%]"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-xl border border-amber-300 shadow-sm">
                    <Image
                      src={`/${item.image}`}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => {
                        setIsCartOpen(false);
                        toggleMenu(false);
                      }}
                      className="block max-w-[70%]"
                    >
                      <p className="text-sm md:text-md text-black hover:text-amber-700 transition-colors duration-200 line-clamp-2 leading-tight">
                        {item.title}
                      </p>
                    </Link>

                    <RemoveButtonWithConfirm
                      itemTitle={item.title}
                      onConfirmRemove={() => removeFromCart(item.slug, true)}
                      className="flex-shrink-0"
                    />
                  </div>

                  <p className="font-bold text-black text-sm md:text-base mt-1">
                    {currencyFormatter.format(item.price / 100)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="mt-2 flex items-center gap-2 md:gap-3">
                    <p className="text-sm md:text-md font-mono">Qty:</p>
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item.slug, item.quantity - 1)
                      }
                      className="flex justify-center items-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.slug, Math.max(1, +e.target.value))
                      }
                      className="w-12 h-7 md:w-14 md:h-8 text-center text-black font-semibold text-sm md:text-base border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 appearance-none"
                      aria-label={`Quantity of ${item.title}`}
                    />

                    <button
                      onClick={() =>
                        updateQuantity(item.slug, item.quantity + 1)
                      }
                      className="flex justify-center items-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <footer className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-t from-amber-50 to-cream border-t border-amber-700/20 shadow-inner">
            <div className="flex justify-between items-center mb-4 md:mb-5">
              <span className="text-md md:text-lg font-medium text-black">
                {cart.length} {cart.length === 1 ? "item" : "items"} in cart
              </span>
              <span className="text-xl md:text-2xl font-bold text-black tracking-tight">
                {currencyFormatter.format(total)}
              </span>
            </div>
            <button
              onClick={() => {
                router.push("/cart");
                setIsCartOpen(false);
              }}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-black py-3 md:py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-400/50 shadow-lg"
            >
              Go to Checkout
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
