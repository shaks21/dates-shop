import { connectToDatabase } from "@/lib/mongoose";
import { Product, IProduct } from "@/models/Product";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Link from "next/link";
import Image from "next/image";
import RelatedProducts from "@/components/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

type LeanProduct = Omit<IProduct, "_id"> & { _id: string };

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  await connectToDatabase();
  const product = await Product.findOne({ slug }).lean<LeanProduct>();
  if (!product) return notFound();

  const plainProduct = {
    ...product,
    _id: product._id.toString(),
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 py-12 lg:px-16">
      {/* Grid: Product + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 max-w-7xl mx-auto">
        {/* Product Content */}
        <div className="bg-zinc-900 bg-opacity-80 rounded-xl shadow-lg p-6 md:p-10">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/#products"
              className="text-white hover:underline text-sm font-mono uppercase tracking-wide"
            >
              ← Back to Shop
            </Link>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Image
              src={`/${plainProduct.image}`}
              alt={plainProduct.title}
              width={400}
              height={300}
              className="w-full h-80 object-cover rounded-lg shadow-md border border-white/20"
            />
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
                {plainProduct.title}
              </h1>
              <p className="text-stone-300 text-lg leading-relaxed">
                {plainProduct.description}
              </p>
              <p className="text-3xl font-extrabold">${(plainProduct.price / 100).toFixed(2)}</p>
              <AddToCartButton product={plainProduct} />
            </div>
          </div>

          {/* Nutrition Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-black uppercase tracking-wide mb-4">
              Nutritional Information
            </h2>
            <ul className="list-disc list-inside text-stone-400 space-y-1 text-base">
              <li>High in dietary fiber and antioxidants</li>
              <li>Rich in potassium, magnesium, and iron</li>
              <li>No added sugars or preservatives</li>
              <li>100% organic and sun-dried</li>
            </ul>
          </section>

          {/* Reviews */}
          <section className="mt-12">
            <h2 className="text-3xl font-black uppercase tracking-wide mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-6 text-stone-300 text-base">
              <blockquote className="border-l-4 border-white/20 pl-5 italic">
                “Best Ajwa dates I&apos;ve ever had. Authentic and flavorful!”
                <footer className="mt-2 text-stone-500 text-xs">— Fatima A.</footer>
              </blockquote>
              <blockquote className="border-l-4 border-white/20 pl-5 italic">
                “Came beautifully packaged. Will buy again!”
                <footer className="mt-2 text-stone-500 text-xs">— Omar K.</footer>
              </blockquote>
            </div>
          </section>

          {/* Related Products (mobile) */}
          <div className="mt-16 block lg:hidden">
            <RelatedProducts currentSlug={plainProduct.slug} />
          </div>
        </div>

        {/* Related Products Sidebar (desktop only) */}
        <aside className="hidden lg:block">
          <RelatedProducts currentSlug={plainProduct.slug} />
        </aside>
      </div>
    </div>
  );
}
