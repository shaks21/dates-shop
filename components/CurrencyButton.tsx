"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from 'lucide-react';

const currencies = ["SAR", "USD", "EUR", "GBP", "AED"];

export default function CurrencyButton() {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("SAR");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div className="h-full flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1 flex items-center gap-1 text-sm  rounded hover:opacity-70 transition"
          aria-label="Select Currency"
        >
          Currency: <span className="font-semibold">{selectedCurrency}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-[color:var(--color-gold)] shadow-md rounded z-50">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => handleCurrencyChange(currency)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {currency}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
