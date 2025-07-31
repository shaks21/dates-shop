// components/Navbar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import CartButton from "./cart/CartButton";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isCartOpen } = useCart();

  // if (isCartOpen) return null; // Don't render when cart is open
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black">
      <nav className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-sm font-bold tracking-wider text-white">
          DATES CO
        </Link>
        
        {/* Desktop Navigation (hidden on mobile) */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link href="/#about" className="hover:opacity-70">Our Story</Link>
          <Link href="/#products" className="hover:opacity-70">Shop</Link>
          <Link href="/#testimonials" className="hover:opacity-70">Reviews</Link>
          <Link href="/#footer" className="hover:opacity-70">Contact</Link>
          <CartButton />
        </div>

        {/* Mobile Burger Button */}
        <button 
          className="md:hidden flex flex-col gap-1 relative z-60"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-gray-200 z-50 flex flex-col items-center justify-center space-y-12 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <Link 
            href="/#about" 
            className="text-5xl font-black tracking-tighter uppercase
                      transition-all
                      hover:text-transparent 
                      hover:[-webkit-text-stroke:1px_black] 
                      hover:[text-stroke:1px_black]"
            onClick={() => setIsOpen(false)}
          >
            Our Story
          </Link>
          <Link 
            href="/#products" 
            className="text-5xl font-black tracking-tighter uppercase
                      transition-all
                      hover:text-transparent 
                      hover:[-webkit-text-stroke:1px_black] 
                      hover:[text-stroke:1px_black]"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link 
            href="/#testimonials" 
            className="text-5xl font-black tracking-tighter uppercase
                      transition-all
                      hover:text-transparent 
                      hover:[-webkit-text-stroke:1px_black] 
                      hover:[text-stroke:1px_black]"
            onClick={() => setIsOpen(false)}
          >
            Reviews
          </Link>
          <Link 
            href="/#footer" 
            className="text-5xl font-black tracking-tighter uppercase
                      transition-all
                      hover:text-transparent 
                      hover:[-webkit-text-stroke:1px_black] 
                      hover:[text-stroke:1px_black]"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <div className="mt-8">
            <CartButton mobile />
          </div>
        </div>
      </nav>
    </header>
  );
}