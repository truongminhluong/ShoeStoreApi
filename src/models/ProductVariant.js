import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    // Sản phẩm
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Màu
    color: {
      type: String,
      required: true,
      trim: true,
    },

    // Size
    size: {
      type: Number,
      required: true,
    },

    // Số lượng tồn kho
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Ảnh theo màu (không bắt buộc)
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProductVariant", productVariantSchema);