import { create } from "zustand";

type NavState = {
  isMenuOpen: boolean;
  toggleMenu: (value?: boolean) => void;
};

export const useNavStore = create<NavState>((set) => ({
  isMenuOpen: false,
  toggleMenu: (value) =>
    set((state) => ({
      isMenuOpen: value !== undefined ? value : !state.isMenuOpen,
    })),
}));
