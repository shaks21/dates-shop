"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Product } from '@prisma/client';

type SortOption = "title-asc" | "title-desc" | "price-asc" | "price-desc";

const PAGE_SIZE = 9;

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("title-asc");

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch("/api/products", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Product[]) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const newSearch = searchParams?.get("search") || "";
    setSearch(newSearch);
  }, [searchParams]);

  useEffect(() => {
    const filteredProducts = products.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );

    filteredProducts.sort((a, b) => {
      switch (sort) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFiltered(filteredProducts);
    setPage(1);
  }, [search, products, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <div className="text-red-600 text-lg mb-4">Sorry, no products currently.</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-400 text-amber-700 rounded hover:bg-amber-700 hover:text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <div className="text-lg mb-4">No products available at the moment.</div>
        <p className="text-gray-600 mb-6">Please check back later or contact support if the issue persists.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-400 text-amber-700 rounded hover:bg-amber-700 hover:text-white transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 rounded border border-black text-charcoal transition focus:outline-none focus:ring-2 focus:ring-amber-700"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-full sm:max-w-xs px-4 py-2 rounded border border-black text-charcoal transition focus:outline-none focus:ring-2 focus:ring-amber-700"
        >
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <span className="text-sm text-charcoal/70 whitespace-nowrap select-none">
          Showing {paginated.length} of {filtered.length} products
        </span>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg mb-2">No products match your search.</div>
          <p className="text-gray-600">Try adjusting your search terms or browse all products.</p>
          <button 
            onClick={() => setSearch("")}
            className="mt-4 px-4 py-2 bg-amber-400 text-amber-700 rounded hover:bg-amber-700 hover:text-white transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {paginated.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group border border-cream-border rounded-xl overflow-hidden bg-white bg-opacity-90 shadow-md hover:shadow-xl transition-transform hover:scale-[1.02]"
                style={{ borderColor: "var(--color-cream-border)" }}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={`/${product.image}` || "/placeholder-image.jpg"}
                    alt={product.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                  />
                </div>
                <div className="p-6">
                  <h2
                    className="text-xl font-serif font-black uppercase mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {product.title}
                  </h2>
                  <p className="text-sm text-charcoal/70 line-clamp-2 font-sans">
                    {product.description}
                  </p>
                  <div className="mt-4 text-lg font-mono font-bold text-black" >
                    ${(product.price / 100).toFixed(2)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded border border-amber-700 bg-amber-400 text-amber-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-amber-700 hover:text-white"
              >
                Prev
              </button>
              <span className="px-5 py-2 rounded border border-amber-700 bg-amber-400 font-bold text-amber-700 select-none">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded border border-amber-700 bg-amber-400 text-amber-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-amber-700 hover:text-white"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}