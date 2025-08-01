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
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Main Content */}
      <main className="pt-5">
        {/* Hero Section */}
        <section className="px-6 py-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase">
              ORGANIC
              <br />
              DATES
            </h1>
            <hr className="border-white/20 my-12" />
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto opacity-80">
              Premium sun-ripened dates delivered fresh from the oasis
            </p>
          </div>
        </section>

        {/* Products List */}
        <section id="products" className="px-6">
          <div className="w-full mx-auto">
            {/* Section Header */}
            <div className=" text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">
                OUR Collection
              </h2>
              <hr className="w-full h-px border-white/20 mt-12" />
            </div>

            {/* Products Grid as List */}
            <div
              className="space-y-0 transition-all"
              style={{
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {products.map((product, index) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="block group relative overflow-hidden"
                  onMouseEnter={() => setBgImage(product.image)}
                  onMouseLeave={() => setBgImage("")}
                >
                  {/* Optional: faded overlay */}
                  <div className="relative z-10 group cursor-pointer border-b border-white/70  bg-black/10">
                    <div className="flex items-center justify-between py-4 md:py-6">
                      {/* Number */}
                      <div className="text-sm font-mono w-12 px-10">
                        {String(index + 1)}
                      </div>

                      {/* Product Name */}
                      <div className="flex-1 text-center px-8 min-h-[3.5rem] md:min-h-[5rem] lg:min-h-[6rem]">
                        {" "}
                        {/* Fixed height */}
                        <h3
                          className="text-[1.5rem] md:text-[2.25rem] lg:text-[3rem] font-black tracking-tighter uppercase
                   transition-[font-size,color] duration-300 ease-in-out
                   group-hover:text-transparent 
                   group-hover:[-webkit-text-stroke:1px_white] 
                   group-hover:[text-stroke:1px_black]
                   group-hover:text-[1.4rem] md:group-hover:text-[2.15rem] lg:group-hover:text-[2.8rem]"
                        >
                          {product.title}
                        </h3>
                      </div>

                      {/* Price */}
                      {/* <div className="text-right">
                        <span className="text-xl md:text-2xl font-mono">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-10 mb-10">
              <Link href="/products">
              <button className="cursor-pointer text-lg font-light tracking-wider hover:opacity-70 transition-opacity border-b border-white/30 pb-1">
                And More...
              </button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-6 py-10 bg-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">
              Our Story
            </h2>
            <hr className="w-full h-px border-white/20 my-12" />
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-80 max-w-3xl mx-auto">
              At Organic Dates Co., we are passionate about quality and
              sustainability. Our dates are hand-picked at peak ripeness,
              cultivated with care, and never treated with chemicals.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  number: "01",
                  label: "100% Organic",
                  desc: "Pure and natural",
                },
                {
                  number: "02",
                  label: "Sun-Ripened",
                  desc: "Perfect sweetness",
                },
                {
                  number: "03",
                  label: "Eco-Friendly",
                  desc: "Sustainable delivery",
                },
                {
                  number: "04",
                  label: "Premium Grade",
                  desc: "Highest quality",
                },
              ].map(({ number, label, desc }) => (
                <div key={number} className="text-center group">
                  <div className="text-6xl font-black opacity-20 mb-4">
                    {number}
                  </div>
                  <h3 className="text-xl font-bold tracking-wider uppercase mb-2">
                    {label}
                  </h3>
                  <p className="text-sm opacity-70 font-light">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="px-6 py-10 bg-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-center mb-10">
              Testimonials
            </h2>
            <div className="space-y-12">
              {[
                {
                  quote:
                    "Absolutely divine! The dates are soft, juicy, and so flavorful.",
                  author: "Aisha K.",
                },
                {
                  quote:
                    "These are a staple in our home now. You can taste the quality!",
                  author: "Omar R.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="text-center">
                  <blockquote className="text-xl md:text-2xl font-light italic mb-4 opacity-90">
                    "{testimonial.quote}"
                  </blockquote>
                  <cite className="text-sm font-mono opacity-60 not-italic">
                    — {testimonial.author}
                  </cite>
                  {index === 0 && (
                    <hr className="w-32 h-px border-white/20 mx-auto mt-12" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <small className="text-sm font-mono opacity-50 mb-4">
            © {new Date().getFullYear()}, Organic Dates Co., All Rights
            Reserved.
          </small>
          <br />
          <Link
            href="/privacy"
            className="text-sm hover:opacity-70 transition-opacity border-b border-white/30 pb-1"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
