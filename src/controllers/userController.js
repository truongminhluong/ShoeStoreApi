import {
  registerService,
  loginService,
  updateProfileService,
  changePasswordService,
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService,
} from "../services/userService.js";

import { successResponse, errorResponse } from "../utils/response.js";

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

    return successResponse(res, "Đăng ký thành công", data, 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
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

    return successResponse(res, "Đăng nhập thành công", data);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Lấy profile
export const getProfile = async (req, res) => {
  return successResponse(res, "Lấy thông tin thành công", req.user);
};

// Cập nhật profile
export const updateProfile = async (req, res) => {
  try {
    const data = await updateProfileService(req.user._id, req.body);

    return successResponse(res, "Cập nhật thông tin thành công", data);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const error = validateChangePassword(req.body);

    if (error) {
      return errorResponse(res, error, 400);
    }

    await changePasswordService(req.user._id, req.body);

    return successResponse(res, "Đổi mật khẩu thành công");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Quên mật khẩu - gửi OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Vui lòng nhập email", 400);
    }

    const data = await forgotPasswordService(email);

    return successResponse(res, "Mã OTP đã được gửi đến email của bạn", data);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Xác thực OTP
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(res, "Vui lòng nhập email và mã OTP", 400);
    }

    const data = await verifyResetOTPService(email, otp);

    return successResponse(res, "Xác thực OTP thành công", data);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return errorResponse(res, "Vui lòng nhập đầy đủ thông tin", 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const data = await resetPasswordService(email, otp, newPassword);

    return successResponse(res, "Đặt lại mật khẩu thành công", data);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
