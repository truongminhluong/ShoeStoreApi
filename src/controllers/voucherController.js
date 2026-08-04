import {
  getVouchersService,
  validateVoucherService,
} from "../services/voucherService.js";

// =================================
// LẤY DANH SÁCH VOUCHER
// =================================
export const getVouchers = async (req, res, next) => {
  try {
    const vouchers = await getVouchersService();

    res.json({
      success: true,
      data: vouchers,
    });
  } catch (error) {
    next(error);
  }
};

// =================================
// KIỂM TRA VOUCHER
// =================================
export const validateVoucher = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    const result = await validateVoucherService(
      code,
      subtotal
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};