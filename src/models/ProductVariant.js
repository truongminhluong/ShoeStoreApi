import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    // Sản phẩm
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // SKU
    sku: {
      type: String,
      unique: true,
      trim: true,
    },

    // Tên màu
    colorName: {
      type: String,
      required: true,
      trim: true,
    },

    // Mã màu
    colorCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // Size
    size: {
      type: Number,
      required: true,
    },

    // Tồn kho
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Ảnh theo màu
    image: {
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

// Không cho trùng Product + Color + Size
productVariantSchema.index(
  {
    product: 1,
    colorName: 1,
    size: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "ProductVariant",
  productVariantSchema
);