// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import path as needed

export async function GET() {
  try {
    // Fetch all products from PostgreSQL using Prisma
    const products = await prisma.product.findMany();

    // Return the products as JSON
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
