import express from "express";

import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  hideProduct,
  activeProduct,
  deleteAdminProduct,
} from "../controllers/adminProductController.js";

const router = express.Router();

// Admin lấy tất cả sản phẩm
router.get("/", getAdminProducts);

// Admin lấy chi tiết
router.get("/:id", getAdminProductById);

// Admin thêm sản phẩm
router.post("/", createAdminProduct);

// Admin sửa sản phẩm
router.put("/:id", updateAdminProduct);

// Admin ẩn sản phẩm
router.patch("/:id/hide", hideProduct);

// Admin mở lại sản phẩm
router.patch("/:id/active", activeProduct);

// Admin xoá thật
router.delete("/:id", deleteAdminProduct);

export default router;
