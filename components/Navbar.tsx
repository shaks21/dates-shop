// components/Navbar.tsx
"use client";
import CartButton from "./cart/CartButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-white shadow z-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-md sticky top-0 z-50">
        <Link href="/" className="text-3xl font-serif font-extrabold text-amber-900 tracking-wide">
          Organic Dates Co.
        </Link>
        <div className="space-x-6 text-md text-stone-700 font-medium">
          <Link href="/#about" className="hover:text-amber-700">Our Story</Link>
          <Link href="/#products" className="hover:text-amber-700">Shop</Link>
          <Link href="/#testimonials" className="hover:text-amber-700">Reviews</Link>
          <Link href="/#footer" className="hover:text-amber-700">Contact</Link>
          <CartButton />
        </div>
      </nav>

        
    </header>
  );
}
