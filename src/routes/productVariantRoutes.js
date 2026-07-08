import express from "express";

import {
  getVariants,
  getVariantById,
  getVariantsByProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/productVariantController.js";

const router = express.Router();

router.get("/", getVariants);

router.get("/:id", getVariantById);

// Lấy tất cả biến thể của một sản phẩm
router.get("/product/:productId", getVariantsByProduct);

router.post("/", createVariant);

router.put("/:id", updateVariant);

router.delete("/:id", deleteVariant);

export default router;