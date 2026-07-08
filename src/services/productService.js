import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import ProductVariant from "../models/ProductVariant.js";

// Lấy tất cả sản phẩm
export const getProductsService = async () => {
  const products = await Product.find()
    .populate("brand", "name logo")
    .populate("category", "name")
    .sort({
      createdAt: -1,
    });

  return products;
};

// Lấy theo ID
export const getProductByIdService = async (id) => {
  const product = await Product.findById(id)
    .populate("brand", "name logo")
    .populate("category", "name");

  if (!product) {
    throw new ApiError(404, "Không tìm thấy sản phẩm");
  }

  return product;
};

// Thêm sản phẩm
export const createProductService = async (body) => {
  const product = await Product.create(body);

  return product;
};

// Cập nhật sản phẩm
export const updateProductService = async (
  id,
  body
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Không tìm thấy sản phẩm");
  }

  Object.keys(body).forEach((key) => {
    product[key] = body[key];
  });

  await product.save();

  return product;
};

// Xóa sản phẩm
export const deleteProductService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Không tìm thấy sản phẩm");
  }

  await product.deleteOne();
};

// Lấy chi tiết sản phẩm kèm biến thể
export const getProductDetailService = async (id) => {
  const product = await Product.findById(id)
    .populate("brand", "name logo")
    .populate("category", "name");

  if (!product) {
    throw new ApiError(404, "Không tìm thấy sản phẩm");
  }

  const variants = await ProductVariant.find({
    product: id,
  }).sort({
    color: 1,
    size: 1,
  });

  const groupedVariants = {};

  variants.forEach((variant) => {
    if (!groupedVariants[variant.color]) {
      groupedVariants[variant.color] = [];
    }

    groupedVariants[variant.color].push({
      _id: variant._id,
      size: variant.size,
      stock: variant.stock,
      image: variant.image,
    });
  });

  return {
    product,
    variants: groupedVariants,
  };
};