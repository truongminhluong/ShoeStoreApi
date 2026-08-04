import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================
// XÁC THỰC NGƯỜI DÙNG
// ==========================================

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Không có Token",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

// ==========================================
// KIỂM TRA QUYỀN ADMIN
// ==========================================

export const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Chưa đăng nhập",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập",
    });
  }

  next();
};
