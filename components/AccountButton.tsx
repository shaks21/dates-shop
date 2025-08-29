"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function AccountButton() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
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

  const isLoggedIn = !!session?.user;

  return (
    <div ref={dropdownRef}>
      <div className=" h-full flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="w-5 h-5 flex justify-center rounded-full border-2 hover:opacity-70 hover:cursor-pointer transition"
          aria-label="Account"
        >
          <UserIcon className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-800 shadow-md rounded z-50">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                My Account
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/api/auth/signin"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
