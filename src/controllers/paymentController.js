import Order from "../models/Order.js";
import ProductVariant from "../models/ProductVariant.js";

import ApiError from "../utils/ApiError.js";

import {
  createVnpayPaymentUrl,
  verifyVnpaySignature,
} from "../services/vnpayService.js";

// ==========================================
// TẠO URL THANH TOÁN VNPAY
// ==========================================

export const createVnpayPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new ApiError(400, "Thiếu mã đơn hàng");
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      throw new ApiError(404, "Không tìm thấy đơn hàng");
    }

    if (order.paymentMethod !== "vnpay") {
      throw new ApiError(400, "Đơn hàng không sử dụng VNPAY");
    }

    if (order.paymentStatus === "paid") {
      throw new ApiError(400, "Đơn hàng đã được thanh toán");
    }

    let ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    // Nếu có nhiều IP thì lấy IP đầu tiên
    ipAddress = ipAddress.split(",")[0].trim();

    // Chuyển IPv6 localhost về IPv4
    if (ipAddress === "::1" || ipAddress === "::ffff:127.0.0.1") {
      ipAddress = "127.0.0.1";
    }

    const paymentUrl = createVnpayPaymentUrl({
      orderId: order._id,
      amount: order.total,
      ipAddress,
    });

    res.status(200).json({
      success: true,
      message: "Tạo URL thanh toán VNPAY thành công",
      data: {
        paymentUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// VNPAY RETURN
// ==========================================

export const vnpayReturn = async (req, res, next) => {
  try {
    console.log("VNPAY RETURN:", req.query);

    const vnpParams = {
      ...req.query,
    };

    // ===============================
    // KIỂM TRA CHỮ KÝ
    // ===============================

    const isValid = verifyVnpaySignature(vnpParams);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Chữ ký VNPAY không hợp lệ",
      });
    }

    const responseCode = vnpParams.vnp_ResponseCode;

    const txnRef = vnpParams.vnp_TxnRef;

    const transactionNo = vnpParams.vnp_TransactionNo;

    // ===============================
    // TÌM ĐƠN HÀNG
    // ===============================

    const order = await Order.findById(txnRef);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // ===============================
    // ĐÃ THANH TOÁN
    // ===============================

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Đơn hàng đã được thanh toán trước đó",
        data: {
          orderId: order._id,
          transactionNo,
          paymentStatus: order.paymentStatus,
        },
      });
    }

    // ===============================
    // THANH TOÁN THẤT BẠI
    // ===============================

    if (responseCode !== "00") {
      order.paymentStatus = "failed";

      await order.save();

      return res.status(200).json({
        success: false,
        message: "Thanh toán VNPAY thất bại",
        data: {
          orderId: order._id,
          responseCode,
          paymentStatus: order.paymentStatus,
        },
      });
    }

    // ===============================
    // KIỂM TRA TỒN KHO
    // ===============================

    for (const item of order.items) {
      const variant = await ProductVariant.findById(item.variant);

      if (!variant) {
        throw new ApiError(404, "Không tìm thấy biến thể sản phẩm");
      }

      if (variant.stock < item.quantity) {
        throw new ApiError(400, "Sản phẩm không đủ tồn kho");
      }
    }

    // ===============================
    // TRỪ TỒN KHO
    // ===============================

    for (const item of order.items) {
      await ProductVariant.findByIdAndUpdate(item.variant, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // ===============================
    // CẬP NHẬT ĐƠN HÀNG
    // ===============================

    order.paymentStatus = "paid";

    order.status = "confirmed";

    order.transactionId = transactionNo;

    await order.save();

    // ===============================
    // TRẢ KẾT QUẢ
    // ===============================

    return res.status(200).json({
      success: true,
      message: "Thanh toán VNPAY thành công",
      data: {
        orderId: order._id,
        transactionNo,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
