import express from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
  createVnpayPayment,
  vnpayReturn,
} from "../controllers/paymentController.js";

const router = express.Router();

// Tạo URL thanh toán
router.post("/vnpay/create", protect, createVnpayPayment);

// VNPAY trả kết quả về đây
router.get("/vnpay/return", (req, res, next) => {
  console.log("🔥 ROUTE URL:", req.originalUrl);
  console.log("🔥 ROUTE QUERY:", req.query);

  return vnpayReturn(req, res, next);
});

export default router;
