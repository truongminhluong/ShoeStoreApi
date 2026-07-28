import {
  getNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from "../services/notificationService.js";

// ==========================================
// LẤY DANH SÁCH THÔNG BÁO
// ==========================================

export const getNotifications = async (
  req,
  res,
  next,
) => {
  try {
    const notifications =
      await getNotificationsService(
        req.user._id,
      );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ĐẾM THÔNG BÁO CHƯA ĐỌC
// ==========================================

export const getUnreadNotificationCount =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const count =
        await getUnreadNotificationCountService(
          req.user._id,
        );

      res.status(200).json({
        success: true,
        data: {
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  };

// ==========================================
// ĐÁNH DẤU MỘT THÔNG BÁO ĐÃ ĐỌC
// ==========================================

export const markNotificationAsRead =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const { id } = req.params;

      const notification =
        await markNotificationAsReadService(
          id,
          req.user._id,
        );

      res.status(200).json({
        success: true,
        message:
          "Đã đánh dấu thông báo đã đọc",
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  };

// ==========================================
// ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
// ==========================================

export const markAllNotificationsAsRead =
  async (
    req,
    res,
    next,
  ) => {
    try {
      await markAllNotificationsAsReadService(
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message:
          "Đã đánh dấu tất cả thông báo đã đọc",
      });
    } catch (error) {
      next(error);
    }
  };