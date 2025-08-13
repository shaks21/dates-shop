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
    <div
      className="bg-cream border border-cream-border rounded-xl shadow-md p-6"
      style={{ borderColor: "var(--color-cream-border)" }}
    >
      <h3
        className="text-lg font-serif font-semibold uppercase mb-5"
        style={{fontFamily: "'Playfair Display', serif" }}
      >
        Related Products
      </h3>
      <div className="space-y-5">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="flex items-center gap-4 p-2 rounded-lg transition-all duration-200 hover:bg-amber-400 hover:shadow-lg"
            style={{ backgroundColor: "transparent" }}
          >
            <Image
              src={`/${product.image}`}
              alt={product.title}
              width={64}
              height={64}
              className="rounded-md object-cover border border-amber-400"
              style={{ borderColor: "var(--color-amber-400)" }}
            />
            <div className="flex flex-col">
              <span
                className="font-serif font-semibold text-charcoal"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.title}
              </span>
              <span
                className="font-bold"
              >
                ${(product.price / 100).toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
