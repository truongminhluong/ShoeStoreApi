import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

// ==========================================
// TẠO ĐÁNH GIÁ SẢN PHẨM
// ==========================================

export const createReviewService = async (
  userId,
  productId,
  orderId,
  rating,
  comment,
  images = [],
) => {
  // =========================
  // KIỂM TRA ĐƠN HÀNG
  // =========================

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(
      404,
      "Không tìm thấy đơn hàng",
    );
  }

  // =========================
  // CHỈ ĐƯỢC ĐÁNH GIÁ KHI
  // ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG
  // =========================

  if (order.status !== "delivered") {
    throw new ApiError(
      400,
      "Chỉ có thể đánh giá sau khi đơn hàng đã giao thành công",
    );
  }

  // =========================
  // KIỂM TRA SẢN PHẨM CÓ
  // TRONG ĐƠN HÀNG KHÔNG
  // =========================

  const orderItem = order.items.find(
    (item) =>
      item.product.toString() ===
      productId.toString(),
  );

  if (!orderItem) {
    throw new ApiError(
      400,
      "Sản phẩm không thuộc đơn hàng này",
    );
  }

  // =========================
  // KIỂM TRA ĐÃ ĐÁNH GIÁ CHƯA
  // =========================

  const existingReview =
    await Review.findOne({
      user: userId,
      product: productId,
      order: orderId,
    });

  if (existingReview) {
    throw new ApiError(
      400,
      "Bạn đã đánh giá sản phẩm này trong đơn hàng",
    );
  }

  // =========================
  // KIỂM TRA SẢN PHẨM
  // =========================

  const product =
    await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm",
    );
  }

  // =========================
  // TẠO REVIEW
  // =========================

  const review = await Review.create({
    user: userId,
    product: productId,
    order: orderId,
    rating,
    comment,
    images,
  });

  // =========================
  // CẬP NHẬT RATING SẢN PHẨM
  // =========================

  const reviews = await Review.find({
    product: productId,
  });

  const totalRating = reviews.reduce(
    (total, review) =>
      total + review.rating,
    0,
  );

  const averageRating =
    totalRating / reviews.length;

  product.rating = Number(
    averageRating.toFixed(1),
  );

  await product.save();

  return review;
};

// ==========================================
// LẤY DANH SÁCH ĐÁNH GIÁ CỦA SẢN PHẨM
// ==========================================

export const getProductReviewsService = async (
  productId,
) => {
  const reviews = await Review.find({
    product: productId,
  })
    .populate("user", "fullName avatar")
    .sort({
      createdAt: -1,
    });

  return reviews;
};

// ==========================================
// KIỂM TRA SẢN PHẨM ĐÃ ĐƯỢC ĐÁNH GIÁ
// ==========================================

export const checkReviewedService = async (
  userId,
  productId,
  orderId
) => {
  const review = await Review.findOne({
    user: userId,
    product: productId,
    order: orderId,
  });

  return review;
};