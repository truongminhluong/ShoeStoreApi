import mongoose from "mongoose";
import Order from "../models/Order.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";

// ============================================================
// TẠO ĐƠN HÀNG
// ============================================================
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

    // ========================================================
    // KIỂM TRA DANH SÁCH SẢN PHẨM
    // ========================================================

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Đơn hàng phải có ít nhất một sản phẩm");
    }

    // ========================================================
    // KIỂM TRA THÔNG TIN GIAO HÀNG
    // ========================================================

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      throw new ApiError(400, "Thông tin giao hàng không đầy đủ");
    }

    // ========================================================
    // KIỂM TRA PHƯƠNG THỨC THANH TOÁN
    // ========================================================

    const validPaymentMethods = ["cod", "vnpay"];

    if (!validPaymentMethods.includes(paymentMethod)) {
      throw new ApiError(400, "Phương thức thanh toán không hợp lệ");
    }

    let subtotal = 0;

    const orderItems = [];

    // ========================================================
    // KIỂM TRA TỪNG SẢN PHẨM
    // ========================================================

    for (const item of items) {
      const { variant: variantId, quantity } = item;

      // ------------------------------------------------------
      // Kiểm tra quantity
      // ------------------------------------------------------

      if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
        throw new ApiError(400, "Số lượng sản phẩm không hợp lệ");
      }

      // ------------------------------------------------------
      // Kiểm tra variant ID
      // ------------------------------------------------------

      if (!mongoose.Types.ObjectId.isValid(variantId)) {
        throw new ApiError(400, "Mã biến thể sản phẩm không hợp lệ");
      }

      // ------------------------------------------------------
      // Lấy variant
      // ------------------------------------------------------

      const variant = await ProductVariant.findById(variantId)
        .populate("product")
        .session(session);

      if (!variant) {
        throw new ApiError(404, "Không tìm thấy biến thể sản phẩm");
      }

      // ------------------------------------------------------
      // Kiểm tra product
      // ------------------------------------------------------

      if (!variant.product || variant.product.status !== "active") {
        throw new ApiError(400, "Sản phẩm không tồn tại hoặc đã ngừng bán");
      }

      // ------------------------------------------------------
      // Kiểm tra stock
      // ------------------------------------------------------

      if (variant.stock < quantity) {
        throw new ApiError(
          400,
          `Sản phẩm "${variant.product.name}" không đủ số lượng trong kho`,
        );
      }

      // ------------------------------------------------------
      // Lấy giá hiện tại từ database
      // KHÔNG lấy giá từ frontend
      // ------------------------------------------------------

      const price =
        Number(variant.product.discountPrice) > 0
          ? Number(variant.product.discountPrice)
          : Number(variant.product.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new ApiError(
          400,
          `Giá sản phẩm "${variant.product.name}" không hợp lệ`,
        );
      }

      // ------------------------------------------------------
      // Tính subtotal
      // ------------------------------------------------------

      subtotal += price * quantity;

      // ------------------------------------------------------
      // Lưu item
      // ------------------------------------------------------

      orderItems.push({
        product: variant.product._id,
        variant: variant._id,
        quantity,
        price,
      });
    }

    // ========================================================
    // SHIPPING
    // ========================================================

    const safeShippingFee = Math.max(0, Number(shippingFee) || 0);

    // ========================================================
    // DISCOUNT
    // ========================================================

    const safeDiscount = Math.max(0, Number(discount) || 0);

    // Không cho discount > subtotal
    const finalDiscount = Math.min(safeDiscount, subtotal);

    // ========================================================
    // VAT 8%
    //
    // Backend tự tính.
    // Không tin tax từ frontend.
    // ========================================================

    const tax = Math.round(subtotal * 0.08);

    // ========================================================
    // TOTAL
    // ========================================================

    const total = subtotal + safeShippingFee + tax - finalDiscount;

    // ========================================================
    // KIỂM TRA TOTAL
    // ========================================================

    if (!Number.isFinite(total) || total < 0) {
      throw new ApiError(400, "Tổng tiền đơn hàng không hợp lệ");
    }

    // ========================================================
    // TẠO ORDER
    // ========================================================

    const order = new Order({
      user: userId,

      items: orderItems,

      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
      },

      subtotal,

      shippingFee: safeShippingFee,

      tax,

      discount: finalDiscount,

      total,

      paymentMethod,

      paymentStatus: "pending",

      status: "pending",
    });

    await order.save({
      session,
    });

    // ========================================================
    // COD
    //
    // COD: trừ stock ngay khi tạo đơn.
    // ========================================================

    if (paymentMethod === "cod") {
      for (const item of orderItems) {
        const result = await ProductVariant.updateOne(
          {
            _id: item.variant,
            stock: {
              $gte: item.quantity,
            },
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

        if (result.modifiedCount === 0) {
          throw new ApiError(400, "Sản phẩm vừa hết hàng, vui lòng thử lại");
        }
      }
    }

    // ========================================================
    // VNPAY
    //
    // KHÔNG trừ stock tại đây.
    //
    // Chỉ khi VNPAY trả ResponseCode = 00
    // thì callback mới trừ stock.
    // ========================================================

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

// ============================================================
// LẤY ĐƠN HÀNG CỦA USER
// ============================================================
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

// ============================================================
// CHI TIẾT ĐƠN HÀNG
// ============================================================
export const getMyOrderDetailService = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Mã đơn hàng không hợp lệ");
  }

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

// ============================================================
// HỦY ĐƠN HÀNG
// ============================================================
export const cancelOrderService = async (userId, orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // =========================
    // 1. Tìm đơn hàng
    // =========================
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).session(session);

    if (!order) {
      throw new ApiError(404, "Không tìm thấy đơn hàng");
    }

    // =========================
    // 2. Không cho hủy đơn đã hủy
    // =========================
    if (order.status === "cancelled") {
      throw new ApiError(400, "Đơn hàng đã được hủy trước đó");
    }

    // =========================
    // 3. Chỉ cho phép hủy:
    // pending
    // confirmed
    // =========================
    if (!["pending", "confirmed"].includes(order.status)) {
      throw new ApiError(400, "Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    // =========================
    // 4. Xử lý riêng VNPAY
    // =========================
    if (order.paymentMethod === "vnpay" && order.paymentStatus === "paid") {
      throw new ApiError(400, "Đơn hàng đã thanh toán VNPAY, không thể hủy");
    }

    // =========================
    // 5. Hoàn lại stock
    //
    // COD:
    // Stock đã được trừ ngay khi tạo đơn
    //
    // VNPAY:
    // Stock CHƯA bị trừ khi tạo đơn
    // =========================
    if (order.paymentMethod === "cod") {
      for (const item of order.items) {
        if (!item.variant) {
          continue;
        }

        const variant = await ProductVariant.findById(item.variant).session(
          session,
        );

        if (!variant) {
          throw new ApiError(
            404,
            `Không tìm thấy biến thể sản phẩm ${item.variant}`,
          );
        }

        variant.stock += item.quantity;

        await variant.save({ session });
      }
    }

    // =========================
    // 6. Nếu là VNPAY chưa thanh toán
    // => đánh dấu payment failed
    // =========================
    if (order.paymentMethod === "vnpay") {
      order.paymentStatus = "failed";
      order.transactionId = undefined;
    }

    // =========================
    // 7. Cập nhật trạng thái đơn
    // =========================
    order.status = "cancelled";

    await order.save({ session });

    // =========================
    // 8. Commit transaction
    // =========================
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    // =========================
    // Rollback nếu có lỗi
    // =========================
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};
