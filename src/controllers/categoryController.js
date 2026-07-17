import asyncHandler from "../middlewares/asyncHandler.js";

import { successResponse } from "../utils/response.js";

import {
  getCategoriesService,
  getCategoryByIdService,
} from "../services/categoryService.js";

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