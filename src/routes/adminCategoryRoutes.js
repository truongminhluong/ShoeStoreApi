import express from "express";

import {
  getAdminCategories,
  getAdminCategoryById,
  createCategory,
  updateCategory,
  hideCategory,
  activeCategory,
} from "../controllers/adminCategoryController.js";

const router = express.Router();

// Lấy tất cả danh mục
router.get("/", getAdminCategories);

// Lấy danh mục theo ID
router.get("/:id", getAdminCategoryById);

// Thêm danh mục
router.post("/", createCategory);

// Cập nhật danh mục
router.put("/:id", updateCategory);

// Ẩn danh mục
router.patch("/:id/hide", hideCategory);

// Hiện lại danh mục
router.patch("/:id/active", activeCategory);

export default router;