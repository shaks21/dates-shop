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
import { motion } from "framer-motion";

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
      className={`fixed top-0 w-full z-50 bg-(image:--color-navbar)
    border-t border-black
    transition-all duration-300 ${
      scrolled ? "pt-1 shadow-md shadow-black/50" : "pt-2"
    }`}
    >
      <nav className="flex flex-col items-center">
        {/* Top Banner with Slogan & Cart */}
        <div className="relative w-full py-1 border-b-1 border-b-black flex items-center justify-center">
          
          {/* Mobile Burger Button */}
          <button
            className="md:hidden flex flex-col gap-1 absolute right-25 z-60"
            onClick={() => toggleMenu()}
            aria-label="Menu"
          >
            <span
              className={`w-6 h-0.5 bg-black transition-all ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-all ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-all ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>

          {/* Mobile: Show Logo */}
          <div className="md:hidden  bg-blue-500 flex items-center justify-center inset-0">
            <Link href="/" aria-label="Home">
              <Image
                src="/malkilogo.jpeg"
                alt="DateASuperfood Logo"
                width={scrolled ? 50 : 70}
                height={60}
                className="object-contain transition-all duration-300 drop-shadow-sm"
              />
            </Link>
          </div>
          <span className="hidden md:block text-center italic">
            Nature&apos;s Finest. Delivered with Elegance.
          </span>

          

          <div className="hidden md:flex gap-4 absolute right-44 top-1/2 -translate-y-1/2">
            <CurrencyButton />
          </div>

          {/* Cart buttons aligned right on medium and up */}
          <div className=" flex gap-2 md:gap-4 absolute right-4 top-1/2 -translate-y-1/2">
            <SearchButton />
            <AccountButton />
            <CartButton />
          </div>
        </div>

        {/* Logo centered on desktop only */}
        <div className="hidden md:flex justify-center w-full pt-2 bg-white transition-all duration-300">
          <Link href="/" className="flex justify-center">
            <Image
              src="/malkilogo.jpeg"
              alt="DateASuperfood Logo"
              width={scrolled ? 50 : 80} // shrink width
              height={scrolled ? 50 : 80}
              className="object-contain rounded-lg transition-all duration-300"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center space-x-6 text-sm uppercase bg-white text-black w-full py-2">
          <Link
            href="/products"
            className="hover:text-[color:var(--color-navbar)]"
          >
            Shop
          </Link>
          <Link
            href="/#about"
            className="hover:text-[color:var(--color-navbar)] "
          >
            Our Story
          </Link>

          <Link
            href="/#benefits"
            className="hover:text-[color:var(--color-navbar)]"
          >
            Benefits
          </Link>

          <Link
            href="/#footer"
            className="hover:text-[color:var(--color-navbar)]"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            transition: { duration: 0.3 },
          }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {/* Background overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/95 to-gray-100/95 backdrop-blur-sm dark:from-gray-900/95 dark:to-gray-800/95" />

          {/* Menu items container */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {[
              { href: "/products", label: "Shop" },
              { href: "/#about", label: "Our Story" },
              { href: "/#benefits", label: "Benefits" },
              { href: "/#footer", label: "Contact" },
            ].map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  y: isOpen ? 0 : 20,
                  transition: { delay: index * 0.1, duration: 0.4 },
                }}
              >
                <Link
                  href={link.href}
                  className="text-4xl font-light tracking-wide text-gray-800 transition-all duration-300 hover:text-amber-700 dark:text-gray-100 dark:hover:text-amber-300"
                  onClick={() => toggleMenu(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Cart button with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                y: isOpen ? 0 : 20,
                transition: { delay: 0.4, duration: 0.4 },
              }}
              className="mt-8"
            >
              <CurrencyButton />
            </motion.div>

            {/* Cart button with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                y: isOpen ? 0 : 20,
                transition: { delay: 0.4, duration: 0.4 },
              }}
              className="mt-8"
            >
              <CartButton mobile />
            </motion.div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
