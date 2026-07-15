import express from "express";
import favoriteController from "../controllers/favoriteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Các API bên dưới đều yêu cầu đăng nhập
router.use(protect);

// Lấy danh sách yêu thích
router.get("/", favoriteController.getFavorites);

// Thêm sản phẩm
router.post("/:productId", favoriteController.addFavorite);

// Xóa một sản phẩm
router.delete("/:productId", favoriteController.removeFavorite);

// Xóa toàn bộ
router.delete("/", favoriteController.clearFavorite);

export default router;