import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Link from 'next/link';
import Image from 'next/image';
import RelatedProducts from '@/components/RelatedProducts';

const prisma = new PrismaClient();

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen font-sans px-6 py-12 lg:px-16 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-12">
        {/* Product Content */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 md:p-12 border border-cream-border">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/#products"
              className="text-black text-sm font-serif tracking-widest uppercase hover:underline"
            >
              ← Back to Shop
            </Link>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Image
              src={`/${product.image}`}
              alt={product.title}
              width={400}
              height={300}
              className="w-full h-80 object-cover rounded-lg shadow-md border border-amber-400"
              style={{
                borderColor: 'var(--color-amber-400)',
                boxShadow: '0 8px 16px rgb(212 165 116 / 0.25)',
              }}
            />
            <div className="flex flex-col justify-center space-y-6">
              <h1
                className="text-5xl md:text-4xl font-serif font-semibold uppercase tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.title}
              </h1>
              <p className="text-lg leading-relaxed font-sans text-charcoal/80">
                {product.description}
              </p>
              <p className="text-3xl font-extrabold">
                ${(product.price / 100).toFixed(2)}
              </p>
              <AddToCartButton product={product} />
            </div>
          </div>

          {/* Nutrition Section */}
          <section className="mt-12">
            <h2
              className="text-3xl font-serif font-semibold uppercase tracking-wide mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nutritional Information
            </h2>
            <ul className="list-disc list-inside text-black space-y-1 text-base font-sans">
              <li>High in dietary fiber and antioxidants</li>
              <li>Rich in potassium, magnesium, and iron</li>
              <li>No added sugars or preservatives</li>
              <li>100% organic and sun-dried</li>
            </ul>
          </section>

          {/* Reviews */}
          <section className="mt-12">
            <h2
              className="text-3xl font-serif font-semibold uppercase tracking-wide mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Customer Reviews
            </h2>
            <div className="space-y-6 text-charcoal/70 text-base font-sans italic border-l-4 border-amber-700 px-6 py-4 bg-amber-400/30 rounded-md">
              <blockquote>
                “Best Ajwa dates I&apos;ve ever had. Authentic and flavorful!”
                <footer className="mt-2 text-charcoal/50 text-xs font-normal not-italic">
                  — Fatima A.
                </footer>
              </blockquote>
              <blockquote>
                “Came beautifully packaged. Will buy again!”
                <footer className="mt-2 text-charcoal/50 text-xs font-normal not-italic">
                  — Omar K.
                </footer>
              </blockquote>
            </div>
          </section>

          {/* Related Products (mobile) */}
          <div className="mt-16 block lg:hidden">
            <RelatedProducts currentSlug={product.slug} />
          </div>
        </div>

        {/* Related Products Sidebar (desktop only) */}
        <aside className="hidden lg:block">
          <RelatedProducts currentSlug={product.slug} />
        </aside>
      </div>
    </div>
  );
}
