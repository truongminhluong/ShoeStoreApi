import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Người nhận thông báo
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Đơn hàng liên quan
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Tiêu đề
    title: {
      type: String,
      required: true,
    },

    // Nội dung
    message: {
      type: String,
      required: true,
    },

    // Loại thông báo
    type: {
      type: String,
      enum: ["order_status"],
      default: "order_status",
    },

    // Đã đọc hay chưa
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

export default Notification;