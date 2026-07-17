import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";

// Lấy tất cả Variant
export const getVariantsService = async () => {
  return await ProductVariant.find({
    status: "active",
  })
    .populate(
      "product",
      "name image brand category"
    )
    .sort({
      createdAt: -1,
    });
};

// Lấy Variant theo ID
export const getVariantByIdService = async (id) => {
  const variant = await ProductVariant.findOne({
    _id: id,
    status: "active",
  }).populate(
    "product",
    "name image brand category"
  );

  if (!variant) {
    throw new ApiError(404, "Không tìm thấy biến thể");
  }

  return variant;
};

// Lấy Variant theo Product
export const getVariantsByProductService = async (
  productId
) => {
  const product = await Product.findOne({
    _id: productId,
    status: "active",
  });

  if (!product) {
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }

  return await ProductVariant.find({
    product: productId,
    status: "active",
  })
    .sort({
      colorName: 1,
      size: 1,
    });
};