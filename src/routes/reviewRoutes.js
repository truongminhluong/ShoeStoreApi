import express from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
  createReview,
  getProductReviews,
  checkReviewed,
  getMyReviewCount,
} from "../controllers/reviewController.js";

const router = express.Router();

// ==========================================
// KIỂM TRA ĐÃ ĐÁNH GIÁ CHƯA
// ==========================================

// Đặt route này trước "/product/:productId"
router.get("/check/:productId/:orderId", protect, checkReviewed);

// ==========================================
// TẠO ĐÁNH GIÁ SẢN PHẨM
// ==========================================

router.post("/", protect, createReview);

// ==========================================
// ĐẾM SỐ ĐÁNH GIÁ CỦA USER
// ==========================================

router.get("/my/count", protect, getMyReviewCount);

// ==========================================
// LẤY ĐÁNH GIÁ CỦA SẢN PHẨM
// ==========================================

router.get("/product/:productId", getProductReviews);

export default router;
