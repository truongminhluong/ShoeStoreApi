export const validateCreateBrand = (body) => {
  const { name } = body;

  if (!name || name.trim() === "") {
    return "Tên thương hiệu không được để trống";
  }

  return null;
};

export const validateUpdateBrand = (body) => {
  const { name } = body;

  if (!name || name.trim() === "") {
    return "Tên thương hiệu không được để trống";
  }

  return null;
};