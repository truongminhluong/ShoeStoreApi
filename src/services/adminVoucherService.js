import Voucher from "../models/Voucher.js";
import ApiError from "../utils/ApiError.js";

export const getAdminVouchersService = async () => {
  return await Voucher.find().sort({
    createdAt: -1,
  });
};

export const getAdminVoucherByIdService = async (id) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, "Không tìm thấy voucher");
  }

  return voucher;
};

export const createVoucherService = async (data) => {
  const existed = await Voucher.findOne({
    code: data.code.toUpperCase(),
  });

  if (existed) {
    throw new ApiError(400, "Mã voucher đã tồn tại");
  }

  return await Voucher.create({
    ...data,
    code: data.code.toUpperCase(),
  });
};

export const updateVoucherService = async (id, data) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, "Không tìm thấy voucher");
  }

  if (data.code) {
    const existed = await Voucher.findOne({
      code: data.code.toUpperCase(),
      _id: { $ne: id },
    });

    if (existed) {
      throw new ApiError(400, "Mã voucher đã tồn tại");
    }

    data.code = data.code.toUpperCase();
  }

  Object.assign(voucher, data);

  await voucher.save();

  return voucher;
};

export const deleteVoucherService = async (id) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, "Không tìm thấy voucher");
  }

  await voucher.deleteOne();
};

export const changeVoucherStatusService = async (id) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, "Không tìm thấy voucher");
  }

  voucher.status =
    voucher.status === "active" ? "inactive" : "active";

  await voucher.save();

  return voucher;
};