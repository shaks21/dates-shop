import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().lean();
    return NextResponse.json(products, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
