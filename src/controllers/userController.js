import {
  registerService,
  loginService,
  updateProfileService,
  changePasswordService,
} from "../services/userService.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  validateRegister,
  validateLogin,
  validateChangePassword,
} from "../validators/authValidator.js";

// Đăng ký
export const register = async (req, res) => {
  try {
    const error = validateRegister(req.body);

    if (error) {
      return errorResponse(res, error, 400);
    }

    const data = await registerService(req.body);

    return successResponse(
      res,
      "Đăng ký thành công",
      data,
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const error = validateLogin(req.body);

    if (error) {
      return errorResponse(res, error, 400);
    }

    const data = await loginService(req.body);

    return successResponse(
      res,
      "Đăng nhập thành công",
      data
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};

// Lấy profile
export const getProfile = async (req, res) => {
  return successResponse(
    res,
    "Lấy thông tin thành công",
    req.user
  );
};

// Cập nhật profile
export const updateProfile = async (req, res) => {
  try {
    const data = await updateProfileService(
      req.user._id,
      req.body
    );

    return successResponse(
      res,
      "Cập nhật thông tin thành công",
      data
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const error = validateChangePassword(req.body);

    if (error) {
      return errorResponse(res, error, 400);
    }

    await changePasswordService(
      req.user._id,
      req.body
    );

    return successResponse(
      res,
      "Đổi mật khẩu thành công"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.statusCode || 500
    );
  }
};