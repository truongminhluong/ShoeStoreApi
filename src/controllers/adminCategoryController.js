import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getAdminCategoriesService,
  getAdminCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  hideCategoryService,
  activeCategoryService,
} from "../services/adminCategoryService.js";

import {
  validateCreateCategory,
  validateUpdateCategory,
} from "../validators/categoryValidator.js";

// Lấy tất cả danh mục
export const getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await getAdminCategoriesService();

  return successResponse(
    res,
    "Lấy danh sách danh mục thành công",
    categories
  );
});

// Lấy danh mục theo ID
export const getAdminCategoryById = asyncHandler(async (req, res) => {
  const category = await getAdminCategoryByIdService(req.params.id);

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

// Ẩn danh mục
export const hideCategory = asyncHandler(async (req, res) => {
  const category = await hideCategoryService(req.params.id);

  return successResponse(
    res,
    "Ẩn danh mục thành công",
    category
  );
});

// Hiện danh mục
export const activeCategory = asyncHandler(async (req, res) => {
  const category = await activeCategoryService(req.params.id);

  return successResponse(
    res,
    "Hiển thị danh mục thành công",
    category
  );
});