import {
  getAdminOrdersService,
  getAdminOrderByIdService,
  updateOrderStatusService,
} from "../services/adminOrderService.js";

// ==========================================
// LẤY TẤT CẢ ĐƠN HÀNG
// ==========================================

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await getAdminOrdersService();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LẤY CHI TIẾT ĐƠN HÀNG
// ==========================================

export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await getAdminOrderByIdService(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
// ==========================================

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const result = await updateOrderStatusService(id, status);

    res.status(200).json({
      success: true,

      message: "Cập nhật trạng thái đơn hàng thành công",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
