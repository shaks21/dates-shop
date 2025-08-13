// app/products/page.tsx
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <div
      className="min-h-screen font-sans px-6 py-12 lg:px-16"
      style={{ backgroundColor: "var(--color-cream)", color: "var(--color-charcoal)" }}
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-12 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Products
        </h1>

        {/* Wrap client component in Suspense */}
        <Suspense fallback={<ProductsLoading />}>
          <ProductsClient />
        </Suspense>
      </div>
    </div>
  );
}

// Optional: Loading state during hydration
function ProductsLoading() {
  return (
    <div
      className="text-center py-10 italic font-sans text-charcoal/70"
      style={{ color: "var(--color-charcoal)" }}
    >
      <p>Loading products...</p>
    </div>
  );
}
