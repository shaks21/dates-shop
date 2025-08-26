// models/Product.ts
import mongoose, { Schema, Document, model } from "mongoose";

// Define a TypeScript interface
export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number; // in cents
  image: string;
}

// Define the Mongoose schema
const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

// Export the model - use mongoose.models instead of models
export const Product = mongoose.models.Product || model<IProduct>("Product", ProductSchema);