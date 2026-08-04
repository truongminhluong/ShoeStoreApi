import {
  getAdminUsersService,
  getAdminUserByIdService,
} from "../services/adminUserService.js";

// ==========================================
// LẤY DANH SÁCH USER
// ==========================================

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await getAdminUsersService();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LẤY CHI TIẾT USER
// ==========================================

export const getAdminUserById = async (req, res, next) => {
  try {
    const user = await getAdminUserByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};