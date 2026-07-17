import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";


import {
  getAdminProductsService,
  getAdminProductByIdService,
  createAdminProductService,
  updateAdminProductService,
  hideProductService,
  activeProductService,
  deleteAdminProductService,
} from "../services/adminProductService.js";


import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/productValidator.js";




// Admin lấy tất cả sản phẩm
export const getAdminProducts = asyncHandler(async(req,res)=>{


  const products =
    await getAdminProductsService();


  return successResponse(
    res,
    "Admin lấy danh sách sản phẩm thành công",
    products
  );


});




// Admin lấy chi tiết
export const getAdminProductById = asyncHandler(async(req,res)=>{


  const product =
    await getAdminProductByIdService(
      req.params.id
    );


  return successResponse(
    res,
    "Lấy sản phẩm thành công",
    product
  );


});




// Admin thêm sản phẩm
export const createAdminProduct = asyncHandler(async(req,res)=>{


  const error =
    validateCreateProduct(req.body);


  if(error){
    return errorResponse(
      res,
      error,
      400
    );
  }



  const product =
    await createAdminProductService(
      req.body
    );


  return successResponse(
    res,
    "Thêm sản phẩm thành công",
    product,
    201
  );


});




// Admin cập nhật
export const updateAdminProduct = asyncHandler(async(req,res)=>{


  const error =
    validateUpdateProduct(req.body);



  if(error){
    return errorResponse(
      res,
      error,
      400
    );
  }



  const product =
    await updateAdminProductService(
      req.params.id,
      req.body
    );



  return successResponse(
    res,
    "Cập nhật sản phẩm thành công",
    product
  );


});




// Admin ẩn sản phẩm
export const hideProduct = asyncHandler(async(req,res)=>{


  const product =
    await hideProductService(
      req.params.id
    );


  return successResponse(
    res,
    "Ẩn sản phẩm thành công",
    product
  );


});




// Admin bật lại sản phẩm
export const activeProduct = asyncHandler(async(req,res)=>{


  const product =
    await activeProductService(
      req.params.id
    );


  return successResponse(
    res,
    "Kích hoạt sản phẩm thành công",
    product
  );


});




// Admin xóa thật
export const deleteAdminProduct = asyncHandler(async(req,res)=>{


  const result =
    await deleteAdminProductService(
      req.params.id
    );


  return successResponse(
    res,
    result.message
  );


});