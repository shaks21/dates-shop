"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Product = {
  _id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
};

export default function RelatedProducts({ currentSlug }: { currentSlug: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/related-products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p: Product) => p.slug !== currentSlug);
        setProducts(filtered.slice(0, 3)); // Limit to 3
      });
  }, [currentSlug]);

  return (
    <div className="bg-zinc-800 p-6 rounded-xl shadow-md border border-white/10">
      <h3 className="text-xl font-black text-white uppercase mb-4">Related Products</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="flex items-center gap-4 hover:bg-zinc-700 p-2 rounded transition"
          >
            <Image
              src={`/${product.image}`}
              alt={product.title}
              width={60}
              height={60}
              className="rounded-md object-cover w-16 h-16 border border-white/10"
            />
            <div className="flex flex-col text-sm text-white">
              <span className="font-semibold">{product.title}</span>
              <span className="text-gray-200 font-bold">
                ${(product.price / 100).toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
