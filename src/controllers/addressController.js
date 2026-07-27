import {
  getAddressesService,
  createAddressService,
  setDefaultAddressService,
  deleteAddressService,
} from "../services/addressService.js";

// ==========================================
// LẤY DANH SÁCH ĐỊA CHỈ
// ==========================================

export const getAddresses = async (
  req,
  res,
  next
) => {
  try {
    const addresses =
      await getAddressesService(
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: "Lấy danh sách địa chỉ thành công",
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// THÊM ĐỊA CHỈ
// ==========================================

export const createAddress = async (
  req,
  res,
  next
) => {
  try {
    const address =
      await createAddressService(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Thêm địa chỉ thành công",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ĐẶT ĐỊA CHỈ LÀM MẶC ĐỊNH
// ==========================================

export const setDefaultAddress = async (
  req,
  res,
  next
) => {
  try {
    const address =
      await setDefaultAddressService(
        req.user._id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Đặt địa chỉ mặc định thành công",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// XÓA ĐỊA CHỈ
// ==========================================

export const deleteAddress = async (
  req,
  res,
  next
) => {
  try {
    await deleteAddressService(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Xóa địa chỉ thành công",
    });
  } catch (error) {
    next(error);
  }
};