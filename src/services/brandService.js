import Brand from "../models/Brand.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả thương hiệu
export const getBrandsService = async () => {
  const brands = await Brand.find().sort({ createdAt: -1 });

  return brands;
};

// Lấy thương hiệu theo ID
export const getBrandByIdService = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  return brand;
};

// Thêm thương hiệu
export const createBrandService = async (body) => {
  const { name, logo } = body;

  const exist = await Brand.findOne({
    name: name.trim(),
  });

  if (exist) {
    throw new ApiError(400, "Thương hiệu đã tồn tại");
  }

  const brand = await Brand.create({
    name: name.trim(),
    logo: logo || "",
  });

  return brand;
};

// Cập nhật thương hiệu
export const updateBrandService = async (id, body) => {
  const { name, logo } = body;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  // Chỉ kiểm tra trùng tên nếu có truyền name lên
  if (name !== undefined) {
    const exist = await Brand.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (exist) {
      throw new ApiError(400, "Tên thương hiệu đã tồn tại");
    }

    brand.name = name.trim();
  }

  // Chỉ cập nhật logo nếu có truyền lên
  if (logo !== undefined) {
    brand.logo = logo;
  }

  await brand.save();

  return brand;
};

// Xóa thương hiệu
export const deleteBrandService = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new ApiError(404, "Không tìm thấy thương hiệu");
  }

  await brand.deleteOne();
};