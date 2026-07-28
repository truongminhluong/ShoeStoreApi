import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";

// ==========================================
// LẤY DANH SÁCH THÔNG BÁO
// ==========================================

export const getNotificationsService = async (
  userId,
) => {
  const notifications =
    await Notification.find({
      user: userId,
    })
      .populate(
        "order",
        "_id status total",
      )
      .sort({
        createdAt: -1,
      });

  return notifications;
};

// ==========================================
// ĐẾM THÔNG BÁO CHƯA ĐỌC
// ==========================================

export const getUnreadNotificationCountService =
  async (userId) => {
    const count =
      await Notification.countDocuments({
        user: userId,
        isRead: false,
      });

    return count;
  };

// ==========================================
// ĐÁNH DẤU MỘT THÔNG BÁO ĐÃ ĐỌC
// ==========================================

export const markNotificationAsReadService =
  async (
    notificationId,
    userId,
  ) => {
    const notification =
      await Notification.findOne({
        _id: notificationId,
        user: userId,
      });

    if (!notification) {
      throw new ApiError(
        404,
        "Không tìm thấy thông báo",
      );
    }

    notification.isRead = true;

    await notification.save();

    return notification;
  };

// ==========================================
// ĐÁNH DẤU TẤT CẢ THÔNG BÁO ĐÃ ĐỌC
// ==========================================

export const markAllNotificationsAsReadService =
  async (userId) => {
    await Notification.updateMany(
      {
        user: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );
  };