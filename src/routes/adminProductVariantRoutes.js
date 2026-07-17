import express from "express";

import {
  getAdminVariants,
  getAdminVariantById,
  createAdminVariant,
  updateAdminVariant,
  deleteAdminVariant,
  restoreAdminVariant,
} from "../controllers/adminProductVariantController.js";

const router = express.Router();

// Danh sách tất cả Variant
router.get("/", getAdminVariants);

// Chi tiết Variant
router.get("/:id", getAdminVariantById);

// Thêm Variant
router.post("/", createAdminVariant);

// Sửa Variant
router.put("/:id", updateAdminVariant);

// Ẩn Variant
router.delete("/:id", deleteAdminVariant);

// Khôi phục Variant
router.patch("/:id/restore", restoreAdminVariant);

export default router;