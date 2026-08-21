import mongoose from "mongoose";
import Order from "../models/Order.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";

// ===============================
// TẠO ĐƠN HÀNG
// ===============================
export const createOrderService = async (userId, orderData) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      items,
      shippingAddress,
      shippingFee = 0,
      discount = 0,
      paymentMethod = "cod",
    } = orderData;

    // ======================================================
    // KIỂM TRA DANH SÁCH SẢN PHẨM
    // ======================================================

    if (!items || items.length === 0) {
      throw new ApiError(400, "Đơn hàng phải có ít nhất một sản phẩm");
    }

    // ======================================================
    // KIỂM TRA THÔNG TIN GIAO HÀNG
    // ======================================================

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      throw new ApiError(400, "Thông tin giao hàng không đầy đủ");
    }

    // ======================================================
    // KIỂM TRA PHƯƠNG THỨC THANH TOÁN
    // ======================================================

    const validPaymentMethods = ["cod", "vnpay"];

    if (!validPaymentMethods.includes(paymentMethod)) {
      throw new ApiError(400, "Phương thức thanh toán không hợp lệ");
    }

    let subtotal = 0;

    const orderItems = [];

    // ======================================================
    // KIỂM TRA SẢN PHẨM
    // ======================================================

    for (const item of items) {
      const { variant: variantId, quantity } = item;

      // --------------------------------------------------
      // Kiểm tra số lượng
      // --------------------------------------------------

      if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
        throw new ApiError(400, "Số lượng sản phẩm không hợp lệ");
      }

      // --------------------------------------------------
      // Lấy Variant
      // --------------------------------------------------

      const variant = await ProductVariant.findById(variantId)
        .populate("product")
        .session(session);

      if (!variant) {
        throw new ApiError(404, "Không tìm thấy biến thể sản phẩm");
      }

      // --------------------------------------------------
      // Kiểm tra Product
      // --------------------------------------------------

      if (!variant.product || variant.product.status !== "active") {
        throw new ApiError(400, "Sản phẩm không tồn tại hoặc đã ngừng bán");
      }

      // --------------------------------------------------
      // Kiểm tra tồn kho
      // --------------------------------------------------

      if (variant.stock < quantity) {
        throw new ApiError(
          400,
          `Sản phẩm "${variant.product.name}" không đủ số lượng trong kho`,
        );
      }

      // --------------------------------------------------
      // Lấy giá hiện tại
      // --------------------------------------------------

      const price =
        Number(variant.product.discountPrice) > 0
          ? Number(variant.product.discountPrice)
          : Number(variant.product.price);

      // --------------------------------------------------
      // Tính subtotal
      // --------------------------------------------------

      subtotal += price * quantity;

      // --------------------------------------------------
      // Lưu item vào order
      // --------------------------------------------------

      orderItems.push({
        product: variant.product._id,
        variant: variant._id,
        quantity,
        price,
      });
    }

    // ======================================================
    // KIỂM TRA DISCOUNT
    // ======================================================

    const safeDiscount = Math.max(0, Number(discount) || 0);

    const safeShippingFee = Math.max(0, Number(shippingFee) || 0);

    // Không cho discount lớn hơn subtotal
    const finalDiscount = Math.min(safeDiscount, subtotal);

    // ======================================================
    // TÍNH TOTAL
    // ======================================================

    const total = subtotal + safeShippingFee - finalDiscount;

    // ======================================================
    // TẠO ĐƠN HÀNG
    // ======================================================

    const order = new Order({
      user: userId,

      items: orderItems,

      shippingAddress,

      subtotal,

      shippingFee: safeShippingFee,

      discount: finalDiscount,

      total,

      paymentMethod,

      paymentStatus: "pending",

      status: "pending",
    });

    await order.save({ session });

    // ======================================================
    // COD
    // Trừ tồn kho ngay
    // ======================================================

    if (paymentMethod === "cod") {
      for (const item of items) {
        const result = await ProductVariant.updateOne(
          {
            _id: item.variant,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            session,
          },
        );

        // Không trừ được stock
        if (result.modifiedCount === 0) {
          throw new ApiError(400, "Sản phẩm vừa hết hàng, vui lòng thử lại");
        }
      }
    }

    // ======================================================
    // COMMIT
    // ======================================================

    await session.commitTransaction();

    return order;
  } catch (error) {
    // ======================================================
    // ROLLBACK
    // ======================================================

    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

// ===============================
// LẤY ĐƠN HÀNG CỦA USER
// ===============================
export const getMyOrdersService = async (userId) => {
  const orders = await Order.find({
    user: userId,
  })
    .populate("items.product", "name image price discountPrice")
    .populate("items.variant", "colorName colorCode size image")
    .sort({
      createdAt: -1,
    });

  return orders;
};

// ===============================
// CHI TIẾT ĐƠN HÀNG
// ===============================
export const getMyOrderDetailService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate("items.product", "name image price discountPrice")
    .populate("items.variant", "colorName colorCode size image");

  if (!order) {
    throw new ApiError(404, "Không tìm thấy đơn hàng");
  }

  return order;
};

// ===============================
// HỦY ĐƠN HÀNG
// ===============================
export const cancelOrderService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Không tìm thấy đơn hàng");
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    throw new ApiError(400, "Không thể hủy đơn hàng ở trạng thái hiện tại");
  }

  // ===============================
  // HOÀN TRẢ SỐ LƯỢNG KHO
  // ===============================

  for (const item of order.items) {
    const variant = await ProductVariant.findById(item.variant);

    if (variant) {
      variant.stock += item.quantity;

      await variant.save();
    }
  }

  // ===============================
  // CẬP NHẬT TRẠNG THÁI ĐƠN
  // ===============================

  order.status = "cancelled";

  await order.save();

  return order;
};
