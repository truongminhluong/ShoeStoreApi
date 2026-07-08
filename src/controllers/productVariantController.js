import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getVariantsService,
  getVariantByIdService,
  getVariantsByProductService,
  createVariantService,
  updateVariantService,
  deleteVariantService,
} from "../services/productVariantService.js";

import {
  validateCreateVariant,
  validateUpdateVariant,
} from "../validators/productVariantValidator.js";

// Lấy tất cả biến thể
export const getVariants = asyncHandler(async (req, res) => {
  const variants = await getVariantsService();

  return successResponse(
    res,
    "Lấy danh sách biến thể thành công",
    variants
  );
});

// Lấy biến thể theo ID
export const getVariantById = asyncHandler(async (req, res) => {
  const variant = await getVariantByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy biến thể thành công",
    variant
  );
});

// Lấy tất cả biến thể theo sản phẩm
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

// Thêm biến thể
export const createVariant = asyncHandler(async (req, res) => {
  const error = validateCreateVariant(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const variant = await createVariantService(req.body);

  return successResponse(
    res,
    "Thêm biến thể thành công",
    variant,
    201
  );
});

// Cập nhật biến thể
export const updateVariant = asyncHandler(async (req, res) => {
  const error = validateUpdateVariant(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const variant = await updateVariantService(
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    "Cập nhật biến thể thành công",
    variant
  );
});

// Xóa biến thể
export const deleteVariant = asyncHandler(async (req, res) => {
  await deleteVariantService(req.params.id);

  return successResponse(
    res,
    "Xóa biến thể thành công"
  );
});