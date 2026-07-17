import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";
import { generateSku } from "../utils/generateSku.js";

// Lấy tất cả Variant
export const getAdminVariantsService = async () => {
  return await ProductVariant.find()
    .populate("product", "name image brand category")
    .sort({
      createdAt: -1,
    });
};

// Lấy Variant theo ID
export const getAdminVariantByIdService = async (id) => {
  const variant = await ProductVariant.findById(id).populate(
    "product",
    "name image brand category"
  );

  if (!variant) {
    throw new ApiError(404, "Không tìm thấy biến thể");
  }

  return variant;
};

// Thêm Variant
export const createAdminVariantService = async (body) => {
  const {
    product,
    colorName,
    colorCode,
    size,
    stock,
    image,
  } = body;

  const existProduct = await Product.findOne({
    _id: product,
    status: "active",
  });

  if (!existProduct) {
    throw new ApiError(404, "Sản phẩm không tồn tại hoặc đã bị ẩn");
  }

  // Nếu đã có tên màu thì mã màu phải giống nhau
  const existColor = await ProductVariant.findOne({
    colorName: {
      $regex: `^${colorName}$`,
      $options: "i",
    },
  });

  if (
    existColor &&
    existColor.colorCode !== colorCode.toUpperCase()
  ) {
    throw new ApiError(
      400,
      "Tên màu đã tồn tại với mã màu khác"
    );
  }

  // Kiểm tra trùng Product + Color + Size
  const existVariant = await ProductVariant.findOne({
    product,
    colorName,
    size,
  });

  if (existVariant) {
    throw new ApiError(400, "Biến thể đã tồn tại");
  }

  const variant = await ProductVariant.create({
    product,
    sku: generateSku(),
    colorName,
    colorCode: colorCode.toUpperCase(),
    size,
    stock,
    image,
  });

  return await variant.populate(
    "product",
    "name image brand category"
  );
};

// Cập nhật
export const updateAdminVariantService = async (id, body) => {
  const variant = await ProductVariant.findById(id);

  if (!variant) {
    throw new ApiError(404, "Không tìm thấy biến thể");
  }

  const newColorName =
    body.colorName ?? variant.colorName;

  const newColorCode =
    body.colorCode?.toUpperCase() ??
    variant.colorCode;

  const newSize =
    body.size ?? variant.size;

  // Kiểm tra tên màu
  const existColor = await ProductVariant.findOne({
    colorName: {
      $regex: `^${newColorName}$`,
      $options: "i",
    },
    _id: {
      $ne: variant._id,
    },
  });

  if (
    existColor &&
    existColor.colorCode !== newColorCode
  ) {
    throw new ApiError(
      400,
      "Tên màu đã tồn tại với mã màu khác"
    );
  }

  // Kiểm tra Variant
  const existVariant = await ProductVariant.findOne({
    product: variant.product,
    colorName: newColorName,
    size: newSize,
    _id: {
      $ne: variant._id,
    },
  });

  if (existVariant) {
    throw new ApiError(400, "Biến thể đã tồn tại");
  }

  variant.colorName = newColorName;
  variant.colorCode = newColorCode;
  variant.size = newSize;
  variant.stock = body.stock ?? variant.stock;
  variant.image = body.image ?? variant.image;
  variant.status = body.status ?? variant.status;

  await variant.save();

  return await variant.populate(
    "product",
    "name image brand category"
  );
};

// Ẩn
export const deleteAdminVariantService = async (id) => {
  const variant = await ProductVariant.findById(id);

  if (!variant) {
    throw new ApiError(404, "Không tìm thấy biến thể");
  }

  variant.status = "inactive";

  await variant.save();

  return variant;
};

// Khôi phục
export const restoreAdminVariantService = async (id) => {
  const variant = await ProductVariant.findById(id);

  if (!variant) {
    throw new ApiError(404, "Không tìm thấy biến thể");
  }

  const product = await Product.findOne({
    _id: variant.product,
    status: "active",
  });

  if (!product) {
    throw new ApiError(
      400,
      "Không thể khôi phục vì sản phẩm đã bị ẩn"
    );
  }

  variant.status = "active";

  await variant.save();

  return variant;
};