import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Tên sản phẩm
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Mô tả
    description: {
      type: String,
      default: "",
    },

    // Giá gốc
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Giá giảm
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Ảnh sản phẩm
    image: {
      type: String,
      default: "",
    },

    // Thương hiệu
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    // Danh mục
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Đã bán
    sold: {
      type: Number,
      default: 0,
    },

    // Đánh giá
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    // Sản phẩm nổi bật
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Trạng thái sản phẩm
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

export default mongoose.model("Product", productSchema);