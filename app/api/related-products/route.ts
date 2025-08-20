import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const products = await Product.find({}, "title slug price image").lean();
    
    return Response.json(products);
    
  } catch (err) {
    console.error("Database error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
    return Response.json({ message: errorMessage }, { status: 500 });
  }
}

// Add other HTTP methods to prevent 405 errors
export async function POST() {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}