import express from "express";

import {
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  cancelOrder,
} from "../controllers/orderController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ===============================
// USER ORDER
// ===============================

// Tạo đơn hàng
router.post(
  "/",
  protect,
  createOrder
);

// Lấy danh sách đơn hàng của User
router.get(
  "/",
  protect,
  getMyOrders
);

// Lấy chi tiết đơn hàng
router.get(
  "/:id",
  protect,
  getMyOrderDetail
);

// Hủy đơn hàng
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

export default router;