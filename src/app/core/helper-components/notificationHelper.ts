import {NotificationStatus, UserNotification} from "../model/userNotification";
import {DateUtils} from "../utils/dateUtils";

export class NotificationHelper {
  getUserUnreadNotificationsSize(userNotifications: UserNotification[]): number {
    return userNotifications.filter(notification => {
      return this.isNotificationUnread(notification);
    })
      .length;
  }
  isNotificationUnread(notification: UserNotification) {
    return notification.status === NotificationStatus.UNREAD;
  }
  hasUserUnreadNotifications(userNotifications: UserNotification[]): boolean{
    return this.getUserUnreadNotificationsSize(userNotifications) > 0;
  }
  getNotificationLabel(notification: UserNotification) {
    return DateUtils.getTimeLabel(notification.date)+', '+DateUtils.getDateLabel(notification.date) + ' - '+notification.message;
  }
  isNotificationInactive(notification: UserNotification) {
    return notification.status === NotificationStatus.ACTIONED ||
      notification.status === NotificationStatus.DISMISSED;
  }
}
