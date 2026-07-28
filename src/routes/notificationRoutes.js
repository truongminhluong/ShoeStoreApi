import express from "express";

import {
  protect,
} from "../middlewares/authMiddleware.js";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const router =
  express.Router();

// Lấy tất cả thông báo
router.get(
  "/",
  protect,
  getNotifications,
);

// Đếm số thông báo chưa đọc
router.get(
  "/unread-count",
  protect,
  getUnreadNotificationCount,
);

// Đánh dấu một thông báo đã đọc
router.put(
  "/:id/read",
  protect,
  markNotificationAsRead,
);

// Đánh dấu tất cả đã đọc
router.put(
  "/read-all",
  protect,
  markAllNotificationsAsRead,
);

export default router;