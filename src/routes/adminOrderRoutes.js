import express from "express";

import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "../controllers/adminOrderController.js";

const router = express.Router();

// Lấy tất cả đơn hàng
router.get("/", getAdminOrders);

// Lấy chi tiết đơn hàng
router.get("/:id", getAdminOrderById);

// Cập nhật trạng thái đơn hàng
router.put(
  "/:id/status",
  updateOrderStatus,
);

export default router;