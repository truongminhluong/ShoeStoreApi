import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getBrandsService,
  getBrandByIdService,
  createBrandService,
  updateBrandService,
  deleteBrandService,
} from "../services/brandService.js";

import {
  validateCreateBrand,
  validateUpdateBrand,
} from "../validators/brandValidator.js";

// Lấy tất cả thương hiệu
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await getBrandsService();

  return successResponse(
    res,
    "Lấy danh sách thương hiệu thành công",
    brands
  );
});

// Lấy thương hiệu theo ID
export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await getBrandByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy thương hiệu thành công",
    brand
  );
});

// Thêm thương hiệu
export const createBrand = asyncHandler(async (req, res) => {
  const error = validateCreateBrand(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const brand = await createBrandService(req.body);

  return successResponse(
    res,
    "Thêm thương hiệu thành công",
    brand,
    201
  );
});

// Cập nhật thương hiệu
export const updateBrand = asyncHandler(async (req, res) => {
  const error = validateUpdateBrand(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const brand = await updateBrandService(
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    "Cập nhật thương hiệu thành công",
    brand
  );
});

// Xóa thương hiệu
export const deleteBrand = asyncHandler(async (req, res) => {
  await deleteBrandService(req.params.id);

  return successResponse(
    res,
    "Xóa thương hiệu thành công"
  );
});