// components/AddToCartButton.tsx
"use client";
import { useCartStore } from "@/lib/stores/cartStore";
// import { IProduct } from "@/models/Product";
import CartDrawer from "./CartDrawer";
import { Product } from '@prisma/client';


export default function AddToCartButton({ product }: { product: Product }) {
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
        // className="px-6 py-3 bg-gradient-to-r from-[#cb7f0e] via-[#D4AF37] to-[#cb7f0e] text-white uppercase tracking-wide font-semibold rounded-none hover:brightness-110 transition"

        className="text-amber-700 border border-amber-700  hover:bg-amber-700 hover:text-white font-black uppercase tracking-wide px-8 py-4 rounded-2xl text-base shadow-xl transition-colors duration-200 cursor-pointer"
      >
        + Add to Cart
      </button>

      <CartDrawer />
    </>
  );
}
