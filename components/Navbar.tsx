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
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? "py-3 bg-cream/98 backdrop-blur-xl shadow-xl shadow-amber-100/40 dark:shadow-black/30"
          : "py-5 bg-transparent"
      } border-b-2 transition-colors duration-700 ${
        scrolled
          ? "border-amber-50 dark:border-amber-900/40"
          : "border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Banner – Slogan & Icons */}
        <div
          className={`flex items-center justify-between text-sm transition-all duration-700 ease-out ${
            scrolled
              ? "opacity-100 max-h-10 visible"
              : "opacity-0 max-h-0 invisible"
          }`}
        >
          {/* Elegant Slogan */}
          <span
            className="font-light italic text-amber-700 dark:text-amber-300 tracking-wide relative"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
          >
            Nature’s Finest. Delivered with Elegance.
            <span className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></span>
          </span>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <CurrencyButton />
            <SearchButton />
            <AccountButton />
            <CartButton />
          </div>
        </div>

        {/* Logo & Navigation */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 z-10" aria-label="Organic Dates Co. Home">
            <div className="relative">
              <Image
                src="/logo-gold.svg"
                alt="Organic Dates Co."
                width={scrolled ? 110 : 140}
                height={scrolled ? 90 : 115}
                className={`transition-all duration-700 ease-out drop-shadow-sm ${
                  scrolled ? "scale-95" : "scale-100"
                }`}
              />
              {/* Subtle Gold Glow Effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(60% 150% at 50% 50%, 
                    rgba(212, 165, 116, 0.3) 0%, 
                    transparent 70%)`,
                }}
              ></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {[
              { href: "/products", label: "Shop" },
              { href: "/#our-story", label: "Our Story" },
              { href: "/#origin", label: "Origin" },
              { href: "/#gifts", label: "Gifts" },
              { href: "/#footer", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group text-sm font-light tracking-wide text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-300 transition-all duration-300 relative pb-1"
              >
                {item.label}
                {/* Animated underline with gold gradient */}
                <span
                  className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 transition-all duration-500 group-hover:w-3/4 group-hover:left-1/4 origin-center rounded-full"
                  style={{
                    filter: "drop-shadow(0 1px 1px rgba(212, 165, 116, 0.4))",
                  }}
                ></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => toggleMenu()}
            className="md:hidden z-20 flex flex-col gap-2 w-8 h-8"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`w-6 h-0.5 rounded-full transition-all duration-500 ease-in-out transform origin-center ${
                  isOpen
                    ? i === 0
                      ? "rotate-45 translate-y-2 scale-110 bg-amber-600 dark:bg-amber-400"
                      : i === 1
                      ? "opacity-0"
                      : "-rotate-45 -translate-y-2 scale-110 bg-amber-600 dark:bg-amber-400"
                    : "bg-gray-900 dark:bg-white"
                }`}
              />
            ))}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-12 text-center transition-all duration-1000 ease-out transform ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-full"
          } bg-gradient-to-br from-amber-50 via-cream to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
          style={{
            background: `linear-gradient(135deg, 
              var(--color-cream) 0%, 
              #fdf5e8 50%, 
              #fffaf0 100%)`,
            backgroundImage: isOpen
              ? "radial-gradient(circle at 50% 30%, rgba(212, 165, 116, 0.15) 0%, transparent 60%), " +
                "linear-gradient(135deg, var(--color-cream) 0%, #fdf5e8 50%, #fffaf0 100%)"
              : "none",
          }}
        >
          {[
            { href: "/#home", label: "Home" },
            { href: "/products", label: "Shop" },
            { href: "/#our-story", label: "Our Story" },
            { href: "/#origin", label: "Origin" },
            { href: "/#testimonials", label: "Reviews" },
            { href: "/#gifts", label: "Gifts" },
            { href: "/#footer", label: "Contact" },
          ].map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => toggleMenu()}
              className="text-5xl md:text-6xl font-light tracking-wide text-gray-800 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-700 relative group animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
              <span className="absolute -bottom-3 left-1/2 w-1/3 h-0.5 bg-amber-500/80 group-hover:w-1/2 transition-all duration-700 -translate-x-1/2 rounded-full"></span>
            </Link>
          ))}

          {/* Mobile CTA + Cart */}
          <div className="flex flex-col items-center space-y-8 mt-16 animate-fadeInUp" style={{ animationDelay: "0.7s" }}>
            <CartButton mobile />
            <Link
              href="/gifts"
              className="text-sm uppercase tracking-widest text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 transition-all duration-300 flex items-center group"
            >
              🎁 Gift Collections
              <span className="block w-6 h-0.5 bg-amber-400 ml-3 group-hover:w-10 transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Global style for animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </header>
  );
}