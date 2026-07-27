import express from "express";

import {
  protect,
} from "../middlewares/authMiddleware.js";

import {
  createVnpayPayment,
  vnpayReturn,
} from "../controllers/paymentController.js";

const router =
  express.Router();

// Tạo URL thanh toán
router.post(
  "/vnpay/create",
  protect,
  createVnpayPayment,
);

// VNPAY trả kết quả về đây
router.get(
  "/vnpay/return",
  vnpayReturn,
);

export default router;