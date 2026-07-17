import asyncHandler from "../middlewares/asyncHandler.js";

import { successResponse } from "../utils/response.js";

import {
  getAdminBrandsService,
  getAdminBrandByIdService,
  createBrandService,
  updateBrandService,
  hideBrandService,
  activeBrandService,
} from "../services/adminBrandService.js";

// Lấy tất cả brand
export const getAdminBrands = asyncHandler(async (req, res) => {
  const brands = await getAdminBrandsService();

  return successResponse(
    res,
    "Lấy danh sách thương hiệu thành công",
    brands
  );
});

// Lấy brand theo ID
export const getAdminBrandById = asyncHandler(async (req, res) => {
  const brand = await getAdminBrandByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy thương hiệu thành công",
    brand
  );
});

// Thêm brand
export const createBrand = asyncHandler(async (req, res) => {
  const brand = await createBrandService(req.body);

  return successResponse(
    res,
    "Thêm thương hiệu thành công",
    brand,
    201
  );
});

// Cập nhật brand
export const updateBrand = asyncHandler(async (req, res) => {
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

// Ẩn brand
export const hideBrand = asyncHandler(async (req, res) => {
  const brand = await hideBrandService(req.params.id);

  return successResponse(
    res,
    "Ẩn thương hiệu thành công",
    brand
  );
});

// Hiện lại brand
export const activeBrand = asyncHandler(async (req, res) => {
  const brand = await activeBrandService(req.params.id);

  return successResponse(
    res,
    "Hiển thị thương hiệu thành công",
    brand
  );
});