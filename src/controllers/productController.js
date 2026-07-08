import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getProductsService,
  getProductDetailService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/productService.js";

import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/productValidator.js";

// Lấy tất cả sản phẩm
export const getProducts = asyncHandler(async (req, res) => {
  const products = await getProductsService();

  return successResponse(
    res,
    "Lấy danh sách sản phẩm thành công",
    products
  );
});

// Lấy chi tiết sản phẩm
export const getProductDetail = asyncHandler(async (req, res) => {
  const data = await getProductDetailService(req.params.id);

  return successResponse(
    res,
    "Lấy chi tiết sản phẩm thành công",
    data
  );
});

// Lấy sản phẩm theo ID
export const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id);

  return successResponse(
    res,
    "Lấy sản phẩm thành công",
    product
  );
});

// Thêm sản phẩm
export const createProduct = asyncHandler(async (req, res) => {
  const error = validateCreateProduct(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const product = await createProductService(req.body);

  return successResponse(
    res,
    "Thêm sản phẩm thành công",
    product,
    201
  );
});

// Cập nhật sản phẩm
export const updateProduct = asyncHandler(async (req, res) => {
  const error = validateUpdateProduct(req.body);

  if (error) {
    return errorResponse(res, error, 400);
  }

  const product = await updateProductService(
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    "Cập nhật sản phẩm thành công",
    product
  );
});

// Xóa sản phẩm
export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id);

  return successResponse(
    res,
    "Xóa sản phẩm thành công"
  );
});