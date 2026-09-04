import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    // ============================================================
    // NGƯỜI ĐẶT HÀNG
    // ============================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ============================================================
    // DANH SÁCH SẢN PHẨM
    // ============================================================

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Đơn hàng phải có ít nhất một sản phẩm",
      },
    },

    // ============================================================
    // THÔNG TIN GIAO HÀNG
    // ============================================================

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ============================================================
    // TIỀN HÀNG
    // ============================================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Phí vận chuyển
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Thuế VAT
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Giảm giá
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Tổng tiền cuối cùng phải thanh toán
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // ============================================================
    // PHƯƠNG THỨC THANH TOÁN
    // ============================================================

    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay"],
      default: "cod",
    },

    // ============================================================
    // TRẠNG THÁI THANH TOÁN
    // ============================================================

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Mã giao dịch VNPAY
    transactionId: {
      type: String,
      default: null,
    },

    // ============================================================
    // TRẠNG THÁI ĐƠN HÀNG
    // ============================================================

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
