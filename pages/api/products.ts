import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongoose";
import { Product, IProduct } from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IProduct[] | { message: string }>
) {
  try {
    await connectToDatabase();

    const products = await Product.find().lean<IProduct[]>();

    res.setHeader("Cache-Control", "no-store"); // Prevent caching
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
}

