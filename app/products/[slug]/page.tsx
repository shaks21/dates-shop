import { connectToDatabase } from "@/lib/mongoose";
import { Product, IProduct } from "@/models/Product";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

type LeanProduct = Omit<IProduct, "_id"> & { _id: any };

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
    <div className="min-h-screen font-sans bg-gradient-to-b from-amber-50 to-white text-stone-800 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 md:p-10">
        {/* Back to Shop */}
        <div className="mb-6">
          <Link href="/#products" className="text-amber-700 hover:underline text-sm">
            ← Back to Shop
          </Link>
        </div>

        {/* Main Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={`/${plainProduct.image}`}
            className="w-full h-80 object-cover rounded-lg shadow-sm"
            alt={plainProduct.title}
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-serif font-bold text-amber-900 mb-4">
              {plainProduct.title}
            </h1>
            <p className="text-stone-700 text-md mb-6 leading-relaxed">
              {plainProduct.description}
            </p>
            <p className="text-2xl font-bold text-amber-700 mb-6">
              ${(plainProduct.price / 100).toFixed(2)}
            </p>
            <div>
              <AddToCartButton product={plainProduct} />
            </div>
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3 text-amber-800">Nutritional Information</h2>
          <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
            <li>High in dietary fiber and antioxidants</li>
            <li>Rich in potassium, magnesium, and iron</li>
            <li>No added sugars or preservatives</li>
            <li>100% organic and sun-dried</li>
          </ul>
        </div>

        {/* Customer Reviews */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3 text-amber-800">Customer Reviews</h2>
          <div className="space-y-4 text-sm text-stone-700">
            <div className="border-l-4 border-amber-500 pl-4">
              <p>“Best Ajwa dates I've ever had. Authentic and flavorful!”</p>
              <span className="text-xs text-stone-500">— Fatima A.</span>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <p>“Came beautifully packaged. Will buy again!”</p>
              <span className="text-xs text-stone-500">— Omar K.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
