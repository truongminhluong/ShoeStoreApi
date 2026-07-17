import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    // Tên thương hiệu
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Logo
    logo: {
      type: String,
      default: "",
    },

    // Trạng thái
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Brand", brandSchema);