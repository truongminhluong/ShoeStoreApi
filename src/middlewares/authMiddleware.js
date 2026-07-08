import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Giải mã Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin User (không lấy password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Không có Token",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};