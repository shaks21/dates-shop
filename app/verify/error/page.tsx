// app/verify/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");

  const message =
    reason === "missing-token"
      ? "Verification token is missing."
      : reason === "invalid-token"
      ? "This verification link is invalid or has expired."
      : "Something went wrong while verifying your email.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ Verification Failed</h1>
        <p className="mt-4 text-gray-700">{message}</p>
        <a
          href="/register"
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}

export default function VerifyErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <VerifyErrorContent />
    </Suspense>
  );
}