import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getAdminVariantsService,
  getAdminVariantByIdService,
  createAdminVariantService,
  updateAdminVariantService,
  deleteAdminVariantService,
  restoreAdminVariantService,
} from "../services/adminProductVariantService.js";

import {
  validateCreateVariant,
  validateUpdateVariant,
} from "../validators/productVariantValidator.js";

// Lấy tất cả Variant
export const getAdminVariants = asyncHandler(async (req, res) => {
  const variants = await getAdminVariantsService();

  return successResponse(
    res,
    "Lấy danh sách biến thể thành công",
    variants
  );
});

// Lấy Variant theo ID
export const getAdminVariantById = asyncHandler(async (req, res) => {
  const variant = await getAdminVariantByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy biến thể thành công",
    variant
  );
});

// Thêm Variant
export const createAdminVariant = asyncHandler(async (req, res) => {
  const error = validateCreateVariant(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const variant = await createAdminVariantService(req.body);

  return successResponse(
    res,
    "Thêm biến thể thành công",
    variant,
    201
  );
});

// Cập nhật Variant
export const updateAdminVariant = asyncHandler(async (req, res) => {
  const error = validateUpdateVariant(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const variant = await updateAdminVariantService(
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    "Cập nhật biến thể thành công",
    variant
  );
});

// Ẩn Variant
export const deleteAdminVariant = asyncHandler(async (req, res) => {
  await deleteAdminVariantService(req.params.id);

  return successResponse(
    res,
    "Ẩn biến thể thành công"
  );
});

// Khôi phục Variant
export const restoreAdminVariant = asyncHandler(async (req, res) => {
  const variant = await restoreAdminVariantService(
    req.params.id
  );

  return successResponse(
    res,
    "Khôi phục biến thể thành công",
    variant
  );
});