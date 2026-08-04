import {
  getAdminVouchersService,
  getAdminVoucherByIdService,
  createVoucherService,
  updateVoucherService,
  deleteVoucherService,
  changeVoucherStatusService,
} from "../services/adminVoucherService.js";

export const getAdminVouchers = async (req, res, next) => {
  try {
    const vouchers = await getAdminVouchersService();

    res.json({
      success: true,
      data: vouchers,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminVoucherById = async (req, res, next) => {
  try {
    const voucher = await getAdminVoucherByIdService(req.params.id);

    res.json({
      success: true,
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
};

export const createVoucher = async (req, res, next) => {
  try {
    const voucher = await createVoucherService(req.body);

    res.status(201).json({
      success: true,
      message: "Thêm voucher thành công",
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVoucher = async (req, res, next) => {
  try {
    const voucher = await updateVoucherService(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Cập nhật voucher thành công",
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVoucher = async (req, res, next) => {
  try {
    await deleteVoucherService(req.params.id);

    res.json({
      success: true,
      message: "Xóa voucher thành công",
    });
  } catch (error) {
    next(error);
  }
};

export const changeVoucherStatus = async (
  req,
  res,
  next
) => {
  try {
    const voucher = await changeVoucherStatusService(
      req.params.id
    );

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
};