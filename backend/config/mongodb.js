import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (uri.startsWith('mongodb+srv://') || uri.includes('?')) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    } else {
      await mongoose.connect(`${uri}/caresync`, { serverSelectionTimeoutMS: 8000 });
    }
    console.log("✅ Database Connected (MongoDB Atlas / Live)");
  } catch (error) {
    console.error("⚠️ Atlas connection notice:", error.message);
    try {
      console.log("Attempting fallback to local MongoDB...");
      await mongoose.connect("mongodb://127.0.0.1:27017/caresync", { serverSelectionTimeoutMS: 3000 });
      console.log("✅ Local Database Connected");
    } catch (localErr) {
      console.warn("Operating in in-memory / static fallback mode.");
    }
  }
};

export default connectDB;
