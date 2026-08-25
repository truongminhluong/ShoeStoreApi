import {
  createReviewService,
  getProductReviewsService,
  checkReviewedService,
  getMyReviewCountService,
} from "../services/reviewService.js";

import Review from "../models/Review.js";

// ==========================================
// TẠO ĐÁNH GIÁ
// ==========================================

export const createReview = async (req, res, next) => {
  try {
    const { productId, orderId, rating, comment, images } = req.body;

    const review = await createReviewService(
      req.user._id,
      productId,
      orderId,
      rating,
      comment,
      images,
    );

    res.status(201).json({
      success: true,
      message: "Đánh giá sản phẩm thành công",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LẤY ĐÁNH GIÁ CỦA SẢN PHẨM
// ==========================================

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await getProductReviewsService(productId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// KIỂM TRA ĐÃ ĐÁNH GIÁ CHƯA
// ==========================================

export const checkReviewed = async (req, res, next) => {
  try {
    const { productId, orderId } = req.params;

    const review = await checkReviewedService(req.user._id, productId, orderId);

    res.status(200).json({
      success: true,

      reviewed: !!review,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ĐẾM SỐ ĐÁNH GIÁ CỦA USER
// ==========================================

export const getMyReviewCount = async (req, res, next) => {
  try {
    const count = await getMyReviewCountService(req.user._id);

    res.status(200).json({
      success: true,
      data: count,
    });
  } catch (error) {
    next(error);
  }
};
