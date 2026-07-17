import express from "express";

import {
  getVariants,
  getVariantById,
  getVariantsByProduct,
} from "../controllers/productVariantController.js";

const router = express.Router();

// Lấy tất cả Variant đang active
router.get("/", getVariants);

// Lấy Variant theo ID
router.get("/:id", getVariantById);

// Lấy Variant theo Product
router.get("/product/:productId", getVariantsByProduct);

export default router;