"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { Minus, Plus, Trash2 } from "lucide-react"; // Use lucide-react icons if available
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart, total } = useCart();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (cart.length === 0)
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center text-gray-600 text-lg">
        Your cart is empty.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-center text-amber-900">
        Your Cart
      </h1>

      {cart.map((item) => (
        <div
          key={item.slug}
          className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <img
              src={`/${item.image}`}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500">
                {(item.price / 100).toFixed(2)} each
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => removeFromCart(item.slug, false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-2"
                >
                  <Minus size={16} />
                </button>
                <span className="text-md font-medium">{item.quantity}</span>
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
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-2"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => removeFromCart(item.slug, true)} // Pass `true` to remove all
                  className="text-red-500 hover:text-red-700 ml-3"
                  title="Remove all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-right font-medium text-gray-800">
            ${((item.price * item.quantity) / 100).toFixed(2)}
          </div>
        </div>
      ))}

      <div className="text-right text-lg font-medium text-gray-800">
        Total: <span className="text-amber-900">${total.toFixed(2)}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <button
          onClick={() => setConfirmOpen(true)}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          Clear Cart
        </button>
        <CheckoutButton total={total} />
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={clearCart}
        title="Clear your cart?"
        description="This will remove all items from your cart."
      />
    </div>
  );
}
