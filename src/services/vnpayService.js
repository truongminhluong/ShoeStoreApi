import crypto from "crypto";
import qs from "qs";

// ==========================================
// TẠO URL THANH TOÁN VNPAY
// ==========================================

export const createVnpayPaymentUrl = ({ orderId, amount, ipAddress }) => {
  const vnp_TmnCode = process.env.VNP_TMN_CODE;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET;
  const vnp_Url = process.env.VNP_URL;
  const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

  // ===============================
  // KIỂM TRA CẤU HÌNH
  // ===============================

  if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
    throw new Error("Thiếu cấu hình VNPAY");
  }

  // ===============================
  // THỜI GIAN TẠO GIAO DỊCH
  // ===============================

  const date = new Date();

  const createDate =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0");

  // ===============================
  // MÃ GIAO DỊCH
  // ===============================

  const txnRef = orderId.toString();

  // ===============================
  // THAM SỐ GỬI VNPAY
  // ===============================

  const vnpParams = {
    vnp_Version: "2.1.0",

    vnp_Command: "pay",

    vnp_TmnCode,

    // Ví dụ:
    // 3.690.000đ -> 369.000.000
    vnp_Amount: Math.round(Number(amount) * 100),

    vnp_CurrCode: "VND",

    vnp_TxnRef: txnRef,

    vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,

    vnp_OrderType: "other",

    vnp_Locale: "vn",

    vnp_ReturnUrl,

    // Chuẩn hóa IP
    vnp_IpAddr: normalizeIpAddress(ipAddress),

    vnp_CreateDate: createDate,
  };

  // ===============================
  // SẮP XẾP THAM SỐ
  // ===============================

  const sortedParams = sortObject(vnpParams);

  // ===============================
  // TẠO CHUỖI KÝ
  // ===============================

  const signData = qs.stringify(sortedParams, {
    encode: false,
  });

  // ===============================
  // TẠO SECURE HASH
  // ===============================

  const secureHash = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  // ===============================
  // THÊM CHỮ KÝ
  // ===============================

  sortedParams.vnp_SecureHash = secureHash;

  // ===============================
  // TẠO URL THANH TOÁN
  // ===============================

  const paymentUrl =
    `${vnp_Url}?` +
    qs.stringify(sortedParams, {
      encode: false,
    });

  return paymentUrl;
};

// ==========================================
// CHUẨN HÓA IP
// ==========================================

const normalizeIpAddress = (ip) => {
  if (!ip) {
    return "127.0.0.1";
  }

  // IPv6 localhost
  if (ip === "::1") {
    return "127.0.0.1";
  }

  // IPv4 được biểu diễn dưới dạng IPv6
  // ::ffff:127.0.0.1
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
};

// ==========================================
// SẮP XẾP OBJECT
// ==========================================

const sortObject = (obj) => {
  const sorted = {};

  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
};

// ==========================================
// KIỂM TRA CHỮ KÝ VNPAY
// ==========================================

export const verifyVnpaySignature = (vnpParams) => {
  const vnp_HashSecret = process.env.VNP_HASH_SECRET;

  if (!vnp_HashSecret) {
    throw new Error("Thiếu VNP_HASH_SECRET");
  }

  // Lấy chữ ký VNPAY gửi về
  const secureHash = vnpParams.vnp_SecureHash;

  // Tạo object mới
  const params = {
    ...vnpParams,
  };

  // Xóa chữ ký cũ
  delete params.vnp_SecureHash;

  // Xóa loại chữ ký nếu có
  delete params.vnp_SecureHashType;

  // Sắp xếp lại tham số
  const sortedParams = sortObject(params);

  // Tạo chuỗi kiểm tra
  const signData = qs.stringify(sortedParams, {
    encode: false,
  });

  // Tạo chữ ký mới
  const checkSum = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  // So sánh không phân biệt chữ hoa/thường
  return secureHash?.toLowerCase() === checkSum.toLowerCase();
};
