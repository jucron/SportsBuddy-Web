import {UserNotification} from "../userNotification";

export interface NotificationsResponse {
  message: string;
  userNotifications: UserNotification[];
}
