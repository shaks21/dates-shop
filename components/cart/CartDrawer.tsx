"use client";
import { useCart } from "@/context/CartContext";
import { X, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, total, addToCart, removeFromCart, updateQuantity } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <>
      {/* Semi-transparent overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" />
      )}

      {/* Cart Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-zinc-900 shadow-2xl z-50 transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[70vh]">
          {cart.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Your cart is empty.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.slug}
                className="flex gap-3 items-start border-b pb-3 border-gray-200 dark:border-zinc-800"
              >
                <Image
                  src={`/${item.image}`}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-zinc-700"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                       <Link href={`/products/${item.slug}`}>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.slug, true)}
                      className="text-red-500 hover:text-red-600 transition"
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
                      className="px-2 py-1 text-sm bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600"
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
                      className="w-12 text-center border border-gray-300 dark:border-zinc-600 rounded py-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.slug, item.quantity + 1)
                      }
                      className="px-2 py-1 text-sm bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600"
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
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-3">
            <p className="font-semibold text-lg text-gray-800 dark:text-white">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={() => {
                router.push("/cart");
                onClose();
              }}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white py-2 rounded-lg font-medium transition"
            >
              Go to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
