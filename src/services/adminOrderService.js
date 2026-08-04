import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";

// ==========================================
// LẤY TẤT CẢ ĐƠN HÀNG CHO ADMIN
// ==========================================

export const getAdminOrdersService = async () => {
  const orders = await Order.find()
    .populate("user", "name email phone")
    .populate("items.product", "name image")
    .populate("items.variant")
    .sort({
      createdAt: -1,
    });

  return orders;
};

// ==========================================
// LẤY CHI TIẾT ĐƠN HÀNG
// ==========================================

export const getAdminOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "name email phone")
    .populate("items.product", "name image")
    .populate("items.variant");

  if (!order) {
    throw new ApiError(404, "Không tìm thấy đơn hàng");
  }

  return order;
};

// ==========================================
// LẤY NỘI DUNG THÔNG BÁO
// ==========================================

const getOrderStatusMessage = (status) => {
  const messages = {
    pending: "Đơn hàng của bạn đang chờ xử lý",
    confirmed: "Đơn hàng của bạn đã được xác nhận",
    shipping: "Đơn hàng của bạn đang được giao",
    delivered: "Đơn hàng của bạn đã giao thành công",
    cancelled: "Đơn hàng của bạn đã bị hủy",
  };

  return messages[status] || "Trạng thái đơn hàng của bạn đã được cập nhật";
};

// ==========================================
// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
// ==========================================

export const updateOrderStatusService = async (orderId, status) => {
  // ===============================
  // TÌM ĐƠN HÀNG
  // ===============================

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Không tìm thấy đơn hàng");
  }

  // ===============================
  // KIỂM TRA TRẠNG THÁI HỢP LỆ
  // ===============================

  const validStatuses = [
    "pending",
    "confirmed",
    "shipping",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Trạng thái đơn hàng không hợp lệ");
  }

  // ===============================
  // KIỂM TRA TRẠNG THÁI HIỆN TẠI
  // ===============================

  const oldStatus = order.status;

  if (oldStatus === status) {
    throw new ApiError(400, "Trạng thái đơn hàng không thay đổi");
  }

  // Không cho cập nhật nếu đơn đã hoàn thành hoặc đã hủy
  if (["delivered", "cancelled"].includes(oldStatus)) {
    throw new ApiError(
      400,
      "Đơn hàng đã hoàn thành hoặc đã hủy, không thể cập nhật",
    );
  }

  // ===============================
  // KIỂM TRA LUỒNG CHUYỂN TRẠNG THÁI
  // ===============================

  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["shipping", "cancelled"],
    shipping: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!validTransitions[oldStatus].includes(status)) {
    throw new ApiError(400, `Không thể chuyển từ ${oldStatus} sang ${status}`);
  }

  // ===============================
  // CẬP NHẬT TRẠNG THÁI
  // ===============================

  order.status = status;

  // Nếu COD và đã giao thì tự động cập nhật thanh toán
  if (status === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
  }

  await order.save();

  // ===============================
  // TẠO THÔNG BÁO CHO USER
  // ===============================

  const notification = await Notification.create({
    user: order.user,
    order: order._id,
    title: "Cập nhật đơn hàng",
    message: getOrderStatusMessage(status),
    type: "order_status",
    isRead: false,
  });

  return {
    order,
    notification,
  };
};
