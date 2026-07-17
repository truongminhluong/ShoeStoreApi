import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả brand
export const getAdminBrandsService = async () => {
  return await Brand.find().sort({
    createdAt: -1,
  });
};

// Lấy brand theo id
export const getAdminBrandByIdService = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  return brand;
};

// Thêm brand
export const createBrandService = async (body) => {
  return await Brand.create(body);
};

// Cập nhật brand
export const updateBrandService = async (id, body) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  Object.keys(body).forEach((key) => {
    brand[key] = body[key];
  });

  await brand.save();

  return brand;
};

// Ẩn brand
export const hideBrandService = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  brand.status = "inactive";
  await brand.save();

  // Ẩn luôn sản phẩm thuộc brand này
  await Product.updateMany(
    { brand: id },
    { status: "inactive" }
  );

  return brand;
};

// Hiện brand
export const activeBrandService = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  brand.status = "active";
  await brand.save();

  // Hiện lại sản phẩm thuộc brand này
  await Product.updateMany(
    { brand: id },
    { status: "active" }
  );

  return brand;
};