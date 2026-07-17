import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả danh mục
export const getAdminCategoriesService = async () => {
  return await Category.find().sort({
    createdAt: -1,
  });
};

// Lấy theo ID
export const getAdminCategoryByIdService = async (id) => {
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

  return await Category.create({
    name: name.trim(),
  });
};

// Cập nhật danh mục
export const updateCategoryService = async (id, body) => {
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

// Ẩn danh mục
export const hideCategoryService = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Không tìm thấy danh mục");
  }

  category.status = "inactive";
  await category.save();

  // Ẩn luôn các sản phẩm thuộc danh mục
  await Product.updateMany(
    {
      category: id,
    },
    {
      status: "inactive",
    }
  );

  return category;
};

// Hiện lại danh mục
export const activeCategoryService = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Không tìm thấy danh mục");
  }

  category.status = "active";
  await category.save();

  // Hiện lại các sản phẩm thuộc danh mục
  await Product.updateMany(
    {
      category: id,
    },
    {
      status: "active",
    }
  );

  return category;
};