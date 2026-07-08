export const validateCreateProduct = (body) => {
  const {
    name,
    price,
    brand,
    category,
  } = body;

  if (!name || name.trim() === "") {
    return "Tên sản phẩm không được để trống";
  }

  if (!price || price <= 0) {
    return "Giá sản phẩm không hợp lệ";
  }

  if (!brand) {
    return "Vui lòng chọn thương hiệu";
  }

  if (!category) {
    return "Vui lòng chọn danh mục";
  }

  return null;
};

export const validateUpdateProduct = (body) => {
  return validateCreateProduct(body);
};