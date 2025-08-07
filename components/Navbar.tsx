// components/Navbar.tsx
"use client";
import Link from "next/link";
import CartButton from "./cart/CartButton";
import { useNavStore } from "@/lib/stores/navStore";
import Image from "next/image";
import SearchButton from "./SearchButton";
import { useEffect, useState } from "react";
import AccountButton from "./AccountButton";
import CurrencyButton from "./CurrencyButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const isOpen = useNavStore((state) => state.isMenuOpen);
  const toggleMenu = useNavStore((state) => state.toggleMenu);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // threshold
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full bg-gradient-to-r from-amber-400 to-[gold] border-t-1  border-t-black z-50 transition-all duration-300 ${
        scrolled ? "pt-1 shadow-md shadow-black/50" : " pt-2"
      }`}
    >
      <nav className="flex flex-col items-center">
        {/* Top Banner with Slogan & Cart */}
        <div className="relative w-full py-1 border-b-1 border-b-black flex items-center justify-center">
          {/* Centered text */}
          <span className="text-center  italic">
            Nature&apos;s Finest. Delivered with Elegance.
          </span>

          <div className="hidden md:flex gap-4 absolute right-44 top-1/2 -translate-y-1/2">
            <CurrencyButton />
          </div>

          {/* Cart buttons aligned right on medium and up */}
          <div className="hidden md:flex gap-4 absolute right-4 top-1/2 -translate-y-1/2">
            <SearchButton />
            <AccountButton />
            <CartButton />
          </div>
        </div>

        {/* Logo centered on desktop only */}
        <div className="hidden md:flex justify-center w-full bg-white transition-all duration-300">
          <Link href="/" className="flex justify-center">
            <Image
              src="/logo.png"
              alt="DateASuperfood Logo"
              width={scrolled ? 70 : 120} // shrink width
              height={scrolled ? 80 : 120}
              className="object-contain rounded-lg transition-all duration-300"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center space-x-6 text-sm uppercase bg-white text-black w-full py-2">
          <Link
            href="/products"
            className="hover:text-[color:var(--color-gold)]"
          >
            Shop
          </Link>
          <Link
            href="/#about"
            className="hover:text-[color:var(--color-gold)] "
          >
            Our Story
          </Link>

          <Link
            href="/#footer"
            className="hover:text-[color:var(--color-gold)]"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Burger Button */}
        <button
          className="md:hidden flex flex-col gap-1 absolute right-4 top-4 z-60"
          onClick={() => toggleMenu()}
          aria-label="Menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-gray-200 z-50 flex flex-col items-center justify-center space-y-12 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {[
            { href: "/#about", label: "Our Story" },
            { href: "/products", label: "Shop" },
            { href: "/#testimonials", label: "Reviews" },
            { href: "/#footer", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-5xl font-black tracking-tighter uppercase transition-all hover:text-transparent hover:[-webkit-text-stroke:1px_black]"
              onClick={() => toggleMenu(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-8">
            <CartButton mobile />
          </div>
        </div>
      </nav>
    </header>
  );
}
