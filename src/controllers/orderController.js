import {
  createOrderService,
  getMyOrdersService,
  getMyOrderDetailService,
  cancelOrderService,
} from "../services/orderService.js";

// Tạo đơn hàng
export const createOrder = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await createOrderService(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách đơn hàng của User
export const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await getMyOrdersService(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết đơn hàng
export const getMyOrderDetail = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await getMyOrderDetailService(
        req.user._id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Hủy đơn hàng
export const cancelOrder = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await cancelOrderService(
        req.user._id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};