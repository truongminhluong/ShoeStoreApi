import Address from "../models/Address.js";

// ==========================================
// LẤY TẤT CẢ ĐỊA CHỈ CỦA USER
// ==========================================

export const getAddressesService = async (userId) => {
  return await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

// ==========================================
// TẠO ĐỊA CHỈ MỚI
// ==========================================

export const createAddressService = async (
  userId,
  addressData
) => {
  const {
    fullName,
    phone,
    addressDetail,
    ward,
    district,
    province,
    isDefault = false,
  } = addressData;

  // Kiểm tra user đã có địa chỉ nào chưa
  const addressCount =
    await Address.countDocuments({
      user: userId,
    });

  // Nếu đây là địa chỉ đầu tiên
  // thì tự động đặt làm mặc định
  const shouldBeDefault =
    addressCount === 0 || isDefault === true;

  // Nếu địa chỉ mới là mặc định
  // thì bỏ mặc định của các địa chỉ cũ
  if (shouldBeDefault) {
    await Address.updateMany(
      {
        user: userId,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  // Tạo địa chỉ mới
  const address = await Address.create({
    user: userId,
    fullName,
    phone,
    addressDetail,
    ward,
    district,
    province,
    isDefault: shouldBeDefault,
  });

  return address;
};

// ==========================================
// ĐẶT ĐỊA CHỈ LÀM MẶC ĐỊNH
// ==========================================

export const setDefaultAddressService = async (
  userId,
  addressId
) => {
  // Kiểm tra địa chỉ có thuộc user hay không
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error(
      "Không tìm thấy địa chỉ"
    );
  }

  // Bỏ mặc định tất cả địa chỉ khác
  await Address.updateMany(
    {
      user: userId,
      _id: {
        $ne: addressId,
      },
    },
    {
      $set: {
        isDefault: false,
      },
    }
  );

  // Đặt địa chỉ được chọn làm mặc định
  address.isDefault = true;

  await address.save();

  return address;
};

// ==========================================
// XÓA ĐỊA CHỈ
// ==========================================

export const deleteAddressService = async (
  userId,
  addressId
) => {
  // Tìm địa chỉ thuộc user
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error(
      "Không tìm thấy địa chỉ"
    );
  }

  // Xóa địa chỉ
  await Address.findByIdAndDelete(addressId);

  // Nếu xóa địa chỉ mặc định
  if (address.isDefault) {
    // Tìm địa chỉ khác của user
    const newDefaultAddress =
      await Address.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    // Nếu vẫn còn địa chỉ
    // thì chọn một địa chỉ làm mặc định
    if (newDefaultAddress) {
      newDefaultAddress.isDefault = true;

      await newDefaultAddress.save();
    }
  }

  return true;
};