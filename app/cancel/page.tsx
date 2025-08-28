import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto mt-24 px-8 py-12 bg-cream text-charcoal rounded-3xl shadow-lg space-y-6 justify-center text-center">
      <ArrowLeftCircle size={56} className="mx-auto text-amber-400" />
      <h1 className="text-3xl font-serif font-black text-center">
        Order Cancelled
      </h1>
      <p className="text-center text-charcoal/70">
        No worries — you&apos;re always welcome back. Explore more and shop at your
        leisure.
      </p>

      <Link
        href="/products"
        className="mt-6 inline-block  bg-amber-400 hover:bg-amber-500 text-black font-serif font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        ← Back to Store
      </Link>
    </div>
  );
}
