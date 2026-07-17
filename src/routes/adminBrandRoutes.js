import express from "express";

import {
  getAdminBrands,
  getAdminBrandById,
  createBrand,
  updateBrand,
  hideBrand,
  activeBrand,
} from "../controllers/adminBrandController.js";

const router = express.Router();

// Lấy tất cả brand
router.get("/", getAdminBrands);

// Lấy brand theo ID
router.get("/:id", getAdminBrandById);

// Thêm brand
router.post("/", createBrand);

// Cập nhật brand
router.put("/:id", updateBrand);

// Ẩn brand
router.patch("/:id/hide", hideBrand);

// Hiện lại brand
router.patch("/:id/active", activeBrand);

export default router;