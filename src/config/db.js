import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI chưa được cấu hình trong file .env");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected");
    return true;
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    return false;
  }
};

export default connectDB;