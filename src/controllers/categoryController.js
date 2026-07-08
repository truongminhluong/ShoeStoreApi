import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";

import {
  validateCreateCategory,
  validateUpdateCategory,
} from "../validators/categoryValidator.js";

// Lấy tất cả danh mục
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await getCategoriesService();

  return successResponse(
    res,
    "Lấy danh sách danh mục thành công",
    categories
  );
});

// Lấy danh mục theo ID
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await getCategoryByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy danh mục thành công",
    category
  );
});

// Thêm danh mục
export const createCategory = asyncHandler(async (req, res) => {
  const error = validateCreateCategory(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const category = await createCategoryService(req.body);

  return successResponse(
    res,
    "Thêm danh mục thành công",
    category,
    201
  );
});

// Cập nhật danh mục
export const updateCategory = asyncHandler(async (req, res) => {
  const error = validateUpdateCategory(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const category = await updateCategoryService(
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    "Cập nhật danh mục thành công",
    category
  );
});

// Xóa danh mục
export const deleteCategory = asyncHandler(async (req, res) => {
  await deleteCategoryService(req.params.id);

  return successResponse(
    res,
    "Xóa danh mục thành công"
  );
});