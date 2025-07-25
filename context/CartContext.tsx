"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ProductData } from "@/types/product";

export type CartItem = ProductData & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: ProductData) => void;
  removeFromCart: (slug: string, removeAll: boolean) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) setCart(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductData) => {
    setCart((c) => {
      const existing = c.find((i) => i.slug === product.slug);
      if (existing) {
        return c.map((i) =>
          i.slug === product.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...c, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (slug: string, removeAll: boolean = false) => {
  setCart((prev) => {
    return prev
      .map((item) =>
        item.slug === slug
          ? { ...item, quantity: removeAll ? 0 : item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
  });
};

  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, i) => sum + (i.price / 100) * i.quantity, 0);

  const updateQuantity = (slug: string, quantity: number) => {
    setCart((c) =>
      c.map((i) =>
        i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
