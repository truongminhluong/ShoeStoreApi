import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // Tên danh mục
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

export default mongoose.model("Category", categorySchema);