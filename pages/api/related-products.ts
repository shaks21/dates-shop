import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  const products = await Product.find({}, "title slug price image").lean();
  res.status(200).json(products);
}
