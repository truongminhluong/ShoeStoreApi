import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    // Tên màu
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // Mã màu HEX
    hex: {
      type: String,
      required: true,
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

export default mongoose.model("Color", colorSchema);