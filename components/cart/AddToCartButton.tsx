// components/AddToCartButton.tsx
"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { IProduct } from "@/models/Product";
import CartDrawer from "./CartDrawer";

export default function AddToCartButton({ product }: { product: IProduct }) {
  const { addToCart, setIsCartOpen } = useCartStore();
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
        className="bg-white text-black font-black uppercase tracking-wide px-8 py-4 rounded-2xl text-base shadow-xl hover:bg-zinc-100 transition-colors duration-200 cursor-pointer"
      >
        + Add to Cart
      </button>

      <CartDrawer />
    </>
  );
}
