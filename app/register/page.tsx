"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      // 🔥 Automatically log the user in
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (loginResult?.ok) {
        router.push("/dashboard"); // send them to homepage (or /dashboard)
      } else {
        router.push("/login"); // fallback
      }
    } else {
      setError(data.error || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center px-6 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-light text-center text-gray-800 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Join us to shop the finest dates
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-700/40 text-red-700 dark:text-red-200 text-sm text-center border border-red-300 dark:border-red-600">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Name (optional)
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-amber-600 focus:border-amber-600 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-amber-600 focus:border-amber-600 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-amber-600 focus:border-amber-600 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-medium text-sm uppercase tracking-wider transition-colors duration-300 rounded-none ${
              isLoading
                ? "bg-amber-300 text-white cursor-not-allowed"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-700 dark:text-amber-400 hover:underline">
            Log In
          </Link>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full py-3 border border-gray-300 dark:border-gray-600 bg-blue-500 dark:bg-gray-700 text-sm uppercase tracking-wider text-white dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-none"
          >
            Sign up with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
