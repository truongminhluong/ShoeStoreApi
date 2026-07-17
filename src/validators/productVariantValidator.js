// Validate thêm Variant
export const validateCreateVariant = (body) => {
  const {
    product,
    colorName,
    colorCode,
    size,
    stock,
  } = body;

  if (!product) {
    return "Sản phẩm không hợp lệ";
  }

  if (!colorName || colorName.trim() === "") {
    return "Tên màu không được để trống";
  }

  if (!colorCode || colorCode.trim() === "") {
    return "Mã màu không được để trống";
  }

  // Kiểm tra mã màu HEX
  const hexRegex = /^#([A-Fa-f0-9]{6})$/;

  if (!hexRegex.test(colorCode.trim())) {
    return "Mã màu không hợp lệ";
  }

  if (size === undefined || size === null) {
    return "Size không được để trống";
  }

  if (Number(size) <= 0) {
    return "Size không hợp lệ";
  }

  if (stock === undefined || stock === null) {
    return "Số lượng tồn kho không được để trống";
  }

  if (Number(stock) < 0) {
    return "Số lượng tồn kho không hợp lệ";
  }

  return null;
};

// Validate cập nhật Variant
export const validateUpdateVariant = (body) => {
  const {
    colorName,
    colorCode,
    size,
    stock,
  } = body;

  if (
    colorName !== undefined &&
    colorName.trim() === ""
  ) {
    return "Tên màu không được để trống";
  }

  if (colorCode !== undefined) {
    if (colorCode.trim() === "") {
      return "Mã màu không được để trống";
    }

    const hexRegex = /^#([A-Fa-f0-9]{6})$/;

    if (!hexRegex.test(colorCode.trim())) {
      return "Mã màu không hợp lệ";
    }
  }

  if (
    size !== undefined &&
    Number(size) <= 0
  ) {
    return "Size không hợp lệ";
  }

  if (
    stock !== undefined &&
    Number(stock) < 0
  ) {
    return "Số lượng tồn kho không hợp lệ";
  }

  return null;
};