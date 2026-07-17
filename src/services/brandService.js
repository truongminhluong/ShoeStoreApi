import Brand from "../models/Brand.js";
import ApiError from "../utils/ApiError.js";

// Lấy danh sách brand
export const getBrandsService = async () => {
  return await Brand.find({
    status: "active",
  }).sort({
    createdAt: -1,
  });
};

// Lấy brand theo id
export const getBrandByIdService = async (id) => {
  const brand = await Brand.findOne({
    _id: id,
    status: "active",
  });

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  return brand;
};