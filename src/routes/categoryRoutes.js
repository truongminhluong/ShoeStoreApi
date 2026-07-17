import express from "express";

import {
  getCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

const router = express.Router();

// Lấy tất cả danh mục
router.get("/", getCategories);

// Lấy danh mục theo ID
router.get("/:id", getCategoryById);

export default router;