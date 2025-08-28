// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        image: true,
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("Database error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Add other HTTP methods to prevent 405 errors
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
