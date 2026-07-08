import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả danh mục
export const getCategoriesService = async () => {
  const categories = await Category.find().sort({
    createdAt: -1,
  });

  return categories;
};

// Lấy theo ID
export const getCategoryByIdService = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Không tìm thấy danh mục");
  }

  return category;
};

// Thêm danh mục
export const createCategoryService = async (body) => {
  const { name } = body;

  const exist = await Category.findOne({
    name: name.trim(),
  });

  if (exist) {
    throw new ApiError(400, "Danh mục đã tồn tại");
  }

  const category = await Category.create({
    name: name.trim(),
  });

  return category;
};

// Cập nhật
export const updateCategoryService = async (
  id,
  body
) => {
  const { name } = body;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Không tìm thấy danh mục");
  }

  if (name !== undefined) {
    const exist = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (exist) {
      throw new ApiError(400, "Tên danh mục đã tồn tại");
    }

    category.name = name.trim();
  }

  await category.save();

  return category;
};

// Xóa
export const deleteCategoryService = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Không tìm thấy danh mục");
  }

  await category.deleteOne();
};