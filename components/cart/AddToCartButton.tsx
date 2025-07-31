// components/AddToCartButton.tsx
"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { IProduct } from "@/models/Product";
import CartDrawer from "./CartDrawer";

export default function AddToCartButton({ product }: { product: IProduct }) {
  const { addToCart, setIsCartOpen } = useCart();
  // const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          addToCart({
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            image: product.image,
          });
          setIsCartOpen(true);
        }}
        className="bg-amber-800 text-white px-6 py-3 rounded-full text-lg shadow hover:bg-amber-900 transition"
      >
        + Add to Cart
      </button>
      <CartDrawer />
    </>
  );
}
