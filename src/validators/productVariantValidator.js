export const validateCreateVariant = (body) => {
  const {
    product,
    color,
    size,
    stock,
  } = body;

  if (!product) {
    return "Sản phẩm không hợp lệ";
  }

  if (!color || color.trim() === "") {
    return "Màu sắc không được để trống";
  }

  if (!size) {
    return "Size không được để trống";
  }

  if (stock < 0) {
    return "Số lượng không hợp lệ";
  }

  return null;
};

export const validateUpdateVariant = (body) => {
  return validateCreateVariant(body);
};