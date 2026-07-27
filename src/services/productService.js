import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";

// User lấy danh sách sản phẩm đang bán
export const getProductsService = async () => {
  const products = await Product.find({
    status: "active",
  })
    .populate("brand", "name logo")
    .populate("category", "name")
    .sort({
      createdAt: -1,
    });

  return products;
};

// User lấy sản phẩm theo ID
export const getProductByIdService = async (id) => {
  const product = await Product.findOne({
    _id: id,
    status: "active",
  })
    .populate("brand", "name logo")
    .populate("category", "name");

  if (!product) {
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }

  return product;
};

// User lấy chi tiết sản phẩm + danh sách biến thể
export const getProductDetailService = async (id) => {
  const product = await Product.findOne({
    _id: id,
    status: "active",
  })
    .populate("brand", "name logo")
    .populate("category", "name");

  if (!product) {
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }

  const variants = await ProductVariant.find({
    product: id,
    status: "active",
  })
    .select(
      "_id sku colorName colorCode size stock image"
    )
    .sort({
      colorName: 1,
      size: 1,
    });

  return {
    product,
    variants,
  };
};

// User lấy hàng mới về
export const getNewestProductsService = async () => {
  const products = await Product.find({
    status: "active",
  })
    .populate("brand", "name logo")
    .populate("category", "name")
    .sort({
      createdAt: -1,
    })
    .limit(10);

  return products;
};