import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductData } from '@/types/product';

export type CartItem = ProductData & { quantity: number };

type CartState = {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: ProductData) => void;
  removeFromCart: (slug: string, removeAll?: boolean) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((item) => item.slug === product.slug);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.slug === product.slug
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (slug, removeAll = false) => {
        const cart = get().cart;
        const updated = cart
          .map((item) =>
            item.slug === slug
              ? { ...item, quantity: removeAll ? 0 : item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0);
        set({ cart: updated });
      },

      updateQuantity: (slug, quantity) => {
        const cart = get().cart;
        set({
          cart: cart.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({
        cart: state.cart,
        isCartOpen: state.isCartOpen,
      }),
    }
  )
);

export const useCartTotal = () =>
  useCartStore((state) =>
    state.cart.reduce(
      (sum, item) => sum + (item.price / 100) * item.quantity,
      0
    )
  );
