// components/CartButton.tsx
"use client";
import { useCartStore } from "@/lib/stores/cartStore";
import { ShoppingCart } from "lucide-react";
// import CartDrawer from "./CartDrawer";

type CartButtonProps = {
  mobile?: boolean;
};

export default function CartButton({ mobile = false }: CartButtonProps) {
  const { cart, isCartOpen, setIsCartOpen } = useCartStore();
  // const [open, setOpen] = useState(false);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <>

      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className={`relative hover:cursor-pointer hover:opacity-70 ${
          mobile ? "flex items-center gap-2 text-2xl" : ""
        }`}
      >
        <ShoppingCart className={mobile ? "w-8 h-8" : "w-6 h-6"} />
        {count > 0 && (
          <span
            className={`absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1 ${
              mobile ? "relative top-0 right-0 text-sm px-2 py-0.5" : ""
            }`}
          >
            {count}
          </span>
        )}
        {mobile && <span>Cart ({count})</span>}
      </button>
      {/* <CartDrawer open={open} onClose={() => setOpen(false)} /> */}
      {/* <CartDrawer /> */}
    </>
  );
}
