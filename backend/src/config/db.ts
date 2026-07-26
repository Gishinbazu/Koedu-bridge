// src/config/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function connectDB() {
  try {
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI is missing! Check your .env file.");
      process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB:", MONGODB_URI);

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectDB;
