import asyncHandler from "../middlewares/asyncHandler.js";

import {
  successResponse
} from "../utils/response.js";


import {
  getBrandsService,
  getBrandByIdService
} from "../services/brandService.js";



// User xem brand
export const getBrands = asyncHandler(async(req,res)=>{


  const brands =
    await getBrandsService();



  return successResponse(
    res,
    "Lấy danh sách thương hiệu thành công",
    brands
  );


});




// User xem chi tiết brand
export const getBrandById = asyncHandler(async(req,res)=>{


  const brand =
    await getBrandByIdService(
      req.params.id
    );


  return successResponse(
    res,
    "Lấy thương hiệu thành công",
    brand
  );


});