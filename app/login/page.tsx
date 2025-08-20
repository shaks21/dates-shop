"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="p-6">
        <p>Welcome, {session.user?.name}</p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Login</h1>

      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with Google
      </button>

      <button
        onClick={() => signIn("credentials", { email: "test@example.com", password: "password" })}
        className="px-4 py-2 bg-gray-700 text-white rounded"
      >
        Sign in with Email/Password
      </button>
    </div>
  );
}
