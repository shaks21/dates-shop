"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in cents
  image: string;
}

type SortOption = "title-asc" | "title-desc" | "price-asc" | "price-desc";

const PAGE_SIZE = 9;

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("title-asc");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  useEffect(() => {
    const newSearch = searchParams?.get("search") || "";
    setSearch(newSearch);
  }, [searchParams]);

  useEffect(() => {
    const filteredProducts = products.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {paginated.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="group border border-cream-border rounded-xl overflow-hidden bg-white bg-opacity-90 shadow-md hover:shadow-xl transition-transform hover:scale-[1.02]"
            style={{ borderColor: "var(--color-cream-border)" }}
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={`/${product.image}`}
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
  );
}
