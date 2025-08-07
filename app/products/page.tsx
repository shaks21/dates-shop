// app/products/page.tsx
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 text-center">
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
    <div className="text-center py-10">
      <p className="opacity-70">Loading products...</p>
    </div>
  );
}