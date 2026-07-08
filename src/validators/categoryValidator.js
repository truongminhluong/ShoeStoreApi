export const validateCreateCategory = (body) => {
  const { name } = body;

  if (!name || name.trim() === "") {
    return "Tên danh mục không được để trống";
  }

  return null;
};

export const validateUpdateCategory = (body) => {
  const { name } = body;

  if (!name || name.trim() === "") {
    return "Tên danh mục không được để trống";
  }

  return null;
};