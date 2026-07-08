import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả biến thể
export const getVariantsService = async () => {
  const variants = await ProductVariant.find()
    .populate("product", "name image")
    .sort({ createdAt: -1 });

  return variants;
};

// Lấy biến thể theo ID
export const getVariantByIdService = async (id) => {
  const variant = await ProductVariant.findById(id).populate(
    "product",
    "name image"
  );

  if (!variant) {
    throw new ApiError(404, "Không tìm thấy biến thể");
  }

  return variant;
};

// Lấy tất cả biến thể của một sản phẩm
export const getVariantsByProductService = async (productId) => {
  // Kiểm tra sản phẩm có tồn tại
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Không tìm thấy sản phẩm");
  }

  const variants = await ProductVariant.find({
    product: productId,
  }).sort({
    color: 1,
    size: 1,
  });

  return variants;
};

// Thêm biến thể
export const createVariantService = async (body) => {
  const {
    product,
    color,
    size,
    stock,
    image,
  } = body;

  // Kiểm tra sản phẩm
  const existProduct = await Product.findById(product);

  if (!existProduct) {
    throw new ApiError(404, "Sản phẩm không tồn tại");
  }

  // Kiểm tra trùng màu + size
  const existVariant = await ProductVariant.findOne({
    product,
    color,
    size,
  });

  if (existVariant) {
    throw new ApiError(
      400,
      "Biến thể đã tồn tại"
    );
  }

  const variant = await ProductVariant.create({
    product,
    color,
    size,
    stock,
    image,
  });

  return variant;
};

// Cập nhật biến thể
export const updateVariantService = async (
  id,
  body
) => {
  const variant = await ProductVariant.findById(id);

  if (!variant) {
    throw new ApiError(
      404,
      "Không tìm thấy biến thể"
    );
  }

  Object.keys(body).forEach((key) => {
    variant[key] = body[key];
  });

  await variant.save();

  return variant;
};

// Xóa biến thể
export const deleteVariantService = async (id) => {
  const variant = await ProductVariant.findById(id);

  if (!variant) {
    throw new ApiError(
      404,
      "Không tìm thấy biến thể"
    );
  }

  await variant.deleteOne();
};