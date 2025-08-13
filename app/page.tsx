"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AlternatingImages from "@/components/AlternatingImages";
import Image from "next/image";
import OrbitImageSelector from "@/components/OrbitImageSelector";

type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
};

// Fade-in animation wrapper
const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 30 },
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dark, setDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const images = ["/hero4.jpeg", "/hero2.jpg", "/hero3.jpg"];

  useEffect(() => {
    setLoaded(true);
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 ${
        dark ? "bg-gray-900 text-gray-100" : "bg-cream text-gray-900"
      }`}
    >
      {/* Loading Animation */}
      {!loaded && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-light text-amber-800 tracking-wide"
          >
            Organic Dates Co.
          </motion.div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      {/* <button
        onClick={() => setDark(!dark)}
        className="fixed top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-amber-50 dark:bg-gray-800 dark:text-amber-200 transition-colors"
        aria-label="Toggle dark mode"
      >
        {dark ? "☀️" : "🌙"}
      </button> */}

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section id="home" className="py-6 md:py-10 text-center ">
          <FadeIn>
            <div className="relative w-full mx-auto overflow-hidden shadow-2xl">
              <AlternatingImages
                images={images}
                interval={5000}
                dark={dark}
                showIndicators={true}
                className="shadow-2xl"
              >
                {/* 👇 Hero text now lives INSIDE the carousel */}
                <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-4">
                  Nature Refined
                </h1>
                <p className="text-lg md:text-xl max-w-xl mx-auto opacity-90">
                  Hand-harvested. Sun-ripened. Crafted with care.
                </p>
              </AlternatingImages>
            </div>
          </FadeIn>
        </section>

        <section id="home" className="py-6 md:py-10 text-center ">
          <FadeIn>
            <div className="relative w-full mx-auto overflow-hidden shadow-2xl">
              <OrbitImageSelector />
            </div>
          </FadeIn>
        </section>

        {/* Signature Product Spotlight */}
        <FadeIn>
          <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm uppercase tracking-wider text-amber-700 dark:text-amber-400 font-medium">
                  Signature Collection
                </span>
                <h2 className="text-4xl md:text-5xl font-light mt-2 mb-4 text-gray-800 dark:text-white">
                  Medjool Dates
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Our most prized Medjool dates, hand-selected for their buttery
                  texture and deep caramel sweetness. Sourced from a single
                  orchard in the Jordan Valley.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-xs uppercase tracking-wider px-3 py-1 bg-amber-600 text-white rounded-full">
                    Organic
                  </span>
                  <span className="text-xs uppercase tracking-wider px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                    Limited Batch
                  </span>
                </div>
                <Link href="/products/medjool">
                  <button className="px-8 py-3 bg-gray-900 text-white text-sm uppercase tracking-wider hover:bg-amber-700 transition-all duration-300 rounded-none">
                    Discover
                  </button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src={"/medjool.jpg"}
                    alt="Medjool Dates"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 dark:text-amber-200 font-bold text-xl">
                    ✨
                  </span>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Products List */}
        <FadeIn>
          <section id="products" className="px-6 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-800 dark:text-white mb-6">
                  OUR COLLECTION
                </h2>
                <div className="w-16 h-px bg-amber-600 mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.slice(0, 6).map((product, index) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="block group"
                  >
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-amber-700 transform hover:-translate-y-1 h-full flex flex-col">
                      {/* Image Section */}
                      <div
                        className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden"
                        style={{
                          backgroundImage: product.image
                            ? `url(${product.image})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 text-center flex flex-col flex-grow">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 group-hover:text-amber-700 transition-colors duration-300 line-clamp-1">
                          {product.title}
                        </h3>
                        <p
                          className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg font-light text-gray-800 dark:text-white">
                            ${(product.price / 100).toFixed(2)}
                          </span>
                          <button className="text-xs uppercase tracking-wider text-amber-700 border border-amber-700 px-4 py-2 hover:bg-amber-700 hover:text-white transition-all duration-300 rounded-none">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-16">
                <Link href="/products">
                  <button
                    className={`text-sm uppercase tracking-wider border-b pb-1 transition-all duration-300 ${
                      dark
                        ? "text-gray-300 hover:text-amber-400 hover:border-amber-500"
                        : "text-gray-700 hover:text-amber-700 hover:border-amber-600"
                    }`}
                  >
                    View All Products
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* About Section */}
        <FadeIn>
          <section
            id="our-story"
            className="px-6 py-16 bg-amber-50 dark:bg-gray-800"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-white mb-8">
                OUR STORY
              </h2>
              <div className="w-16 h-px bg-amber-600 mx-auto mb-8"></div>
              <p className="text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                At Organic Dates Co., we are passionate about quality and
                sustainability. Our dates are hand-picked at peak ripeness,
                cultivated with care, and never treated with chemicals. Each
                date represents our commitment to excellence and traditional
                craftsmanship.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Origin Story Timeline */}
        <FadeIn>
          <section id="origin" className="py-20 px-6">
            <div className="max-w-5xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-white mb-4">
                From Tree to Table
              </h2>
              <div className="w-16 h-px bg-amber-600 mx-auto mb-6"></div>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A journey of care, tradition, and nature’s rhythm.
              </p>
            </div>

            <div className="space-y-16">
              {[
                {
                  step: "Harvest",
                  desc: "Hand-picked at dawn for peak freshness",
                  img: "/harvest.jpg",
                },
                {
                  step: "Clean",
                  desc: "Naturally washed and sun-dried",
                  img: "/clean.jpg",
                },
                {
                  step: "Inspect",
                  desc: "Each date hand-checked for quality",
                  img: "/inspect.jpg",
                },
                {
                  step: "Pack",
                  desc: "Eco-packaged with care",
                  img: "/pack.jpg",
                },
              ].map((stage, i) => (
                <FadeIn key={i} delay={i * 0.2}>
                  <div
                    className={`flex w-full ${
                      i % 2 === 1
                        ? "flex-col md:flex-row-reverse"
                        : "flex-col md:flex-row"
                    } items-center gap-10`}
                  >
                    <div className="w-full md:w-1/2 text-center">
                      <h3 className="text-2xl font-light text-gray-800 dark:text-white mb-3">
                        {stage.step}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>

                    <div className="w-full md:w-1/2">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={stage.img}
                          alt={stage.step}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Gift CTA */}
        <FadeIn>
          <section className="py-20 px-6 bg-(image:--color-navbar) text-black">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Curated Gift Boxes
              </h2>
              <p className="text-gray-900 mb-8 text-lg">
                Perfect for weddings, holidays, or moments that matter.
              </p>
              <Link href="/gifts">
                <button className="px-8 py-3 border-2 border-black bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all rounded-none">
                  Explore Gifts
                </button>
              </Link>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <small className="text-xs text-gray-500 dark:text-gray-400 mb-4 block tracking-wide">
            © {new Date().getFullYear()}, Organic Dates Co. All Rights Reserved.
          </small>
          <Link
            href="/privacy"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 border-b border-gray-300 dark:border-gray-700 pb-1"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
