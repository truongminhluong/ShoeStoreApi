export const validateRegister = (body) => {
  const { fullName, email, password } = body;

  if (!fullName || !email || !password) {
    return "Vui lòng nhập đầy đủ thông tin";
  }

  return null;
};

export const validateLogin = (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return "Vui lòng nhập email và mật khẩu";
  }

  return null;
};

export const validateChangePassword = (body) => {
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    return "Vui lòng nhập đầy đủ thông tin";
  }

  return null;
};