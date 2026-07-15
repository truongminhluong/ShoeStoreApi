import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoestore_db";

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
    return true;
  } catch (error) {
    console.log("❌ MongoDB Error:", error.message);
    console.log("⚠️  Sử dụng URI mặc định hoặc kiểm tra MongoDB đang chạy.");
    return false;
  }
};

export default connectDB;