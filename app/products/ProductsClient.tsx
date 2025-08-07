// app/products/ProductsClient.tsx
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

  // Fetch products
  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
      });
  }, []);

  // Sync search param
  useEffect(() => {
    const newSearch = searchParams?.get("search") || "";
    setSearch(newSearch);
  }, [searchParams]);

  // Filter and sort
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 text-black rounded bg-white placeholder-gray-500"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-full sm:max-w-xs px-4 py-2 rounded bg-white text-black"
        >
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <span className="text-sm opacity-50 whitespace-nowrap">
          Showing {paginated.length} of {filtered.length} products
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {paginated.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="group border border-white/10 rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.01] transition"
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={`/${product.image}`}
                alt={product.title}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-black uppercase mb-2">{product.title}</h2>
              <p className="text-sm opacity-70 line-clamp-2">{product.description}</p>
              <div className="mt-4 text-lg font-mono">${(product.price / 100).toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white text-black rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-white text-black rounded font-bold">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white text-black rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}