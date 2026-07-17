import asyncHandler from "../middlewares/asyncHandler.js";

import { successResponse } from "../utils/response.js";

import {
  getVariantsService,
  getVariantByIdService,
  getVariantsByProductService,
} from "../services/productVariantService.js";

// Lấy tất cả Variant
export const getVariants = asyncHandler(async (req, res) => {
  const variants = await getVariantsService();

  return successResponse(
    res,
    "Lấy danh sách biến thể thành công",
    variants
  );
});

// Lấy Variant theo ID
export const getVariantById = asyncHandler(async (req, res) => {
  const variant = await getVariantByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy biến thể thành công",
    variant
  );
});

// Lấy Variant theo Product
export const getVariantsByProduct = asyncHandler(async (req, res) => {
  const variants = await getVariantsByProductService(
    req.params.productId
  );

  return successResponse(
    res,
    "Lấy danh sách biến thể thành công",
    variants
  );
});