import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả danh mục
export const getCategoriesService = async () => {
  return await Category.find({
    status: "active",
  }).sort({
    createdAt: -1,
  });
};

// Lấy theo ID
export const getCategoryByIdService = async (id) => {
  const category = await Category.findOne({
    _id: id,
    status: "active",
  });

  if (!category) {
    throw new ApiError(404, "Không tìm thấy danh mục");
  }

  return category;
};