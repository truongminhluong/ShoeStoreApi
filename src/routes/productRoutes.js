import express from "express";

import {
  getProducts,
  getProductById,
  getProductDetail,
  getNewestProducts,
} from "../controllers/productController.js";

const router = express.Router();

// User lấy danh sách sản phẩm active
router.get("/", getProducts);

// User lấy sản phẩm mới
router.get("/new", getNewestProducts);

// User xem chi tiết sản phẩm
router.get("/detail/:id", getProductDetail);

// User lấy sản phẩm theo id
router.get("/:id", getProductById);

export default router;
