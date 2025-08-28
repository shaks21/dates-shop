// app/login/SearchParamsHandler.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define form data type
interface FormData {
  email: string;
  password: string;
}

// Define props if needed (none used here, but component is self-contained)
const SearchParamsHandler = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  // Prevent loading UI when session is still loading
  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setIsLoading(false);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  if (session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg p-10 max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-light tracking-wide text-gray-800 dark:text-white mb-4">
          Welcome, {session.user?.name || 'Guest'}
        </h2>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full py-3 bg-gray-900 text-white uppercase tracking-wider text-sm hover:bg-amber-700 transition-colors duration-300 rounded-none"
        >
          Sign Out
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg p-10 max-w-md w-full"
    >
      <h2 className="text-3xl font-light text-center text-gray-800 dark:text-white mb-2">
        Welcome Back
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
        Sign in to access your dashboard
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-700/40 text-red-700 dark:text-red-200 text-sm text-center border border-red-300 dark:border-red-600">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="you@example.com"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-amber-600 focus:border-amber-600 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
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
              ? 'bg-amber-300 text-white cursor-not-allowed'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-amber-700 dark:text-amber-400 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          href={`/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
          className="text-amber-700 dark:text-amber-400 hover:underline"
        >
          Sign Up
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
          onClick={() => handleOAuthSignIn('google')}
          className="w-full py-3 border border-gray-300 dark:border-gray-600 bg-blue-500 dark:bg-gray-700 text-sm uppercase tracking-wider text-white dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-none"
        >
          Sign in with Google
        </button>
      </div>
    </motion.div>
  );
};

export default SearchParamsHandler;