import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";
import nodemailer from "nodemailer";

// Đăng ký
export const registerService = async ({
  fullName,
  email,
  password,
  phone,
}) => {
  const exist = await User.findOne({ email });

  if (exist) {
    throw new ApiError(400, "Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
  });

  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    },
  };
};

// Đăng nhập
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Email hoặc mật khẩu không đúng");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Email hoặc mật khẩu không đúng");
  }

  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    },
  };
};

// Cập nhật thông tin
export const updateProfileService = async (userId, body) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  const { fullName, phone, avatar } = body;

  if (fullName !== undefined) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
  };
};

// Đổi mật khẩu
export const changePasswordService = async (userId, body) => {
  const { oldPassword, newPassword } = body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Mật khẩu cũ không đúng");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "Mật khẩu mới phải khác mật khẩu cũ");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
};

// Cấu hình gửi email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Gửi mã OTP quên mật khẩu
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      404,
      "Email chưa được đăng ký"
    );
  }

  // Tạo OTP 6 số
  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  // OTP có hiệu lực 5 phút
  const otpExpires = new Date(
    Date.now() + 5 * 60 * 1000
  );

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = otpExpires;

  await user.save();

  await transporter.sendMail({
    from: `"RYDE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã xác nhận đặt lại mật khẩu - RYDE",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #111;">RYDE</h2>

        <p>Xin chào <strong>${user.fullName}</strong>,</p>

        <p>
          Bạn vừa yêu cầu đặt lại mật khẩu tài khoản RYDE.
        </p>

        <p>Mã xác nhận của bạn là:</p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
          "
        >
          ${otp}
        </div>

        <p>
          Mã này có hiệu lực trong <strong>5 phút</strong>.
        </p>

        <p>
          Nếu bạn không yêu cầu đặt lại mật khẩu,
          vui lòng bỏ qua email này.
        </p>

        <p>Trân trọng,<br/>Đội ngũ RYDE</p>
      </div>
    `,
  });

  return {
    email,
  };
};

// Xác thực OTP
export const verifyResetOTPService = async (
  email,
  otp
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      404,
      "Không tìm thấy người dùng"
    );
  }

  if (!user.resetPasswordOTP) {
    throw new ApiError(
      400,
      "Mã OTP không tồn tại hoặc đã được sử dụng"
    );
  }

  if (
    user.resetPasswordOTPExpires &&
    user.resetPasswordOTPExpires < new Date()
  ) {
    throw new ApiError(
      400,
      "Mã OTP đã hết hạn"
    );
  }

  if (user.resetPasswordOTP !== otp) {
    throw new ApiError(
      400,
      "Mã OTP không chính xác"
    );
  }

  return {
    verified: true,
    email,
  };
};

// Đặt lại mật khẩu
export const resetPasswordService = async (
  email,
  otp,
  newPassword
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      404,
      "Không tìm thấy người dùng"
    );
  }

  if (!user.resetPasswordOTP) {
    throw new ApiError(
      400,
      "Mã OTP không tồn tại hoặc đã được sử dụng"
    );
  }

  if (
    user.resetPasswordOTPExpires &&
    user.resetPasswordOTPExpires < new Date()
  ) {
    throw new ApiError(
      400,
      "Mã OTP đã hết hạn"
    );
  }

  if (user.resetPasswordOTP !== otp) {
    throw new ApiError(
      400,
      "Mã OTP không chính xác"
    );
  }

  // Mã hóa mật khẩu mới
  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  // Xóa OTP sau khi đổi mật khẩu thành công
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  return {
    email: user.email,
  };
};