import express from "express";

import {
  getAddresses,
  createAddress,
  setDefaultAddress,
  deleteAddress,
} from "../controllers/addressController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Lấy danh sách địa chỉ
router.get("/", protect, getAddresses);

// Thêm địa chỉ
router.post("/", protect, createAddress);

// Đặt địa chỉ mặc định
router.put("/:id/default", protect, setDefaultAddress);

// Xóa địa chỉ
router.delete("/:id", protect, deleteAddress);

export default router;
