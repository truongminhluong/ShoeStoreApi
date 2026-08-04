import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// ==========================================
// LẤY DANH SÁCH NGƯỜI DÙNG
// ==========================================

export const getAdminUsersService = async () => {
  const users = await User.find()
    .select("-password")
    .sort({
      createdAt: -1,
    });

  return users;
};

// ==========================================
// LẤY CHI TIẾT NGƯỜI DÙNG
// ==========================================

export const getAdminUserByIdService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  return user;
};