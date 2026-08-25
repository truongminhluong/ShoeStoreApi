import express from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Quên mật khẩu - gửi OTP
router.post("/forgot-password", forgotPassword);

// Xác thực OTP
router.post("/verify-reset-otp", verifyResetOTP);

// Đặt lại mật khẩu
router.post("/reset-password", resetPassword);

// Lấy thông tin cá nhân
router.get("/profile", protect, getProfile);

// Cập nhật thông tin cá nhân
router.put("/profile", protect, updateProfile);

// Đổi mật khẩu khi đã đăng nhập
router.put("/change-password", protect, changePassword);

export default router;
