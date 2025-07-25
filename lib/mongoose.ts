import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    // console.log("✅ Already connected to MongoDB");
    return;
  }

  const conn = await mongoose.connect(MONGODB_URI);
  // console.log(`✅ Connected to MongoDB: ${conn.connection.name}`);

};

