import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse,
} from "../utils/response.js";


import {
  getProductsService,
  getProductDetailService,
  getProductByIdService,
  getNewestProductsService,
} from "../services/productService.js";



// User lấy danh sách sản phẩm
// Chỉ lấy status active
export const getProducts = asyncHandler(async (req, res) => {


  const products = await getProductsService();


  return successResponse(
    res,
    "Lấy danh sách sản phẩm thành công",
    products
  );

});




// User xem chi tiết sản phẩm
export const getProductDetail = asyncHandler(async(req,res)=>{


  const data = await getProductDetailService(
    req.params.id
  );


  return successResponse(
    res,
    "Lấy chi tiết sản phẩm thành công",
    data
  );


});




// User lấy sản phẩm theo ID
export const getProductById = asyncHandler(async(req,res)=>{


  const product = await getProductByIdService(
    req.params.id
  );


  return successResponse(
    res,
    "Lấy sản phẩm thành công",
    product
  );


});





// User lấy hàng mới về
export const getNewestProducts = asyncHandler(async(req,res)=>{


  const products = await getNewestProductsService();


  return successResponse(
    res,
    "Lấy danh sách sản phẩm mới thành công",
    products
  );


});