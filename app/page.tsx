"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-amber-50 to-white text-stone-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-100 to-amber-50 py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-amber-900 mb-6">
          Nature’s Finest Organic Dates
        </h1>
        <p className="text-lg text-stone-700 max-w-2xl mx-auto mb-8">
          Indulge in the rich sweetness of sun-ripened dates, grown sustainably
          and delivered fresh from the oasis to your home.
        </p>
        <Link href="#products">
          <button className="bg-amber-800 text-white px-8 py-3 rounded-full text-lg shadow hover:bg-amber-900 transition">
            Explore Collection
          </button>
        </Link>
      </section>

      {/* About */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold text-amber-900 mb-4">
          Our Story
        </h2>
        <p className="text-stone-700 text-md leading-relaxed max-w-3xl mx-auto">
          At Organic Dates Co., we are passionate about quality and
          sustainability. Our dates are hand-picked at peak ripeness, cultivated
          with care, and never treated with chemicals. We believe in nourishing
          the body and soul through nature’s purest sweets.
        </p>
      </section>

      {/* Features */}
      <section className="bg-white py-12 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
          {[
            { icon: "🌿", label: "100% Organic" },
            { icon: "🌞", label: "Sun-Ripened" },
            { icon: "🚚", label: "Eco-Friendly Delivery" },
            { icon: "✨", label: "Premium Grade Quality" },
          ].map(({ icon, label }, i) => (
            <div
              key={i}
              className="p-6 rounded-lg bg-amber-50 shadow-sm hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <p className="text-md font-medium text-stone-800">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="py-20 px-6 bg-gradient-to-t from-amber-50 to-white"
      >
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-10">
          Our Organic Date Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product.slug}`}>
              <div className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition cursor-pointer p-4">
                <Image
                  src={`/${product.image}`}
                  alt={product.title}
                  width={400}
                  height={300}
                  className="h-52 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-amber-900 mb-1">
                  {product.title}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-amber-700 mt-2">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="px-6 max-w-3xl mx-auto py-16 text-center"
      >
        <h3 className="text-2xl font-bold text-amber-900 mb-6">
          What Our Customers Say
        </h3>
        <div className="space-y-6">
          <blockquote className="bg-white shadow p-6 rounded-xl border border-amber-100">
            <p className="italic">
              “Absolutely divine! The dates are soft, juicy, and so flavorful.”
            </p>
            <p className="text-sm mt-2 font-semibold text-amber-700">
              – Aisha K.
            </p>
          </blockquote>
          <blockquote className="bg-white shadow p-6 rounded-xl border border-amber-100">
            <p className="italic">
              “These are a staple in our home now. You can taste the quality!”
            </p>
            <p className="text-sm mt-2 font-semibold text-amber-700">
              – Omar R.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="bg-white mt-20 py-10 px-6 text-center border-t text-sm text-stone-600"
      >
        <p>
          &copy; {new Date().getFullYear()} Organic Dates Co. All rights
          reserved.
        </p>
        <p className="mt-2">
          <Link href="/privacy" className="underline hover:text-amber-700">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
