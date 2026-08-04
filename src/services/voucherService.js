import Voucher from "../models/Voucher.js";
import ApiError from "../utils/ApiError.js";

// ==============================
// LẤY DANH SÁCH VOUCHER
// ==============================
export const getVouchersService = async () => {
  const now = new Date();

  return await Voucher.find({
    status: "active",
    quantity: { $gt: 0 },
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({
    createdAt: -1,
  });
};

// ==============================
// KIỂM TRA VOUCHER
// ==============================
export const validateVoucherService = async (code, subtotal) => {
  const voucher = await Voucher.findOne({
    code: code.toUpperCase(),
  });

  if (!voucher) {
    throw new ApiError(404, "Voucher không tồn tại");
  }

  if (voucher.status !== "active") {
    throw new ApiError(400, "Voucher không khả dụng");
  }

  const now = new Date();

  if (voucher.startDate > now) {
    throw new ApiError(400, "Voucher chưa đến thời gian sử dụng");
  }

  if (voucher.endDate < now) {
    throw new ApiError(400, "Voucher đã hết hạn");
  }

  if (voucher.quantity <= 0) {
    throw new ApiError(400, "Voucher đã hết lượt");
  }

  if (subtotal < voucher.minOrderValue) {
    throw new ApiError(
      400,
      `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString(
        "vi-VN"
      )}đ`
    );
  }

  let discount = 0;

  // giảm tiền
  if (voucher.discountType === "fixed") {
    discount = voucher.discountValue;
  }

  // giảm %
  else {
    discount = subtotal * voucher.discountValue / 100;

    if (
      voucher.maxDiscount > 0 &&
      discount > voucher.maxDiscount
    ) {
      discount = voucher.maxDiscount;
    }
  }

  return {
    voucher,
    discount,
  };
};