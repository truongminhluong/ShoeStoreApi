import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";

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