import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Người đánh giá
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Sản phẩm được đánh giá
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Đơn hàng
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Số sao
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Nội dung đánh giá
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Hình ảnh đánh giá - có thể làm sau
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Một user chỉ được đánh giá một sản phẩm trong một đơn hàng một lần
reviewSchema.index(
  {
    user: 1,
    product: 1,
    order: 1,
  },
  {
    unique: true,
  },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;