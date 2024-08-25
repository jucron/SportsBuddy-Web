import {UserNotification} from "../userNotification";

export interface UpdateUserNotificationsRequest {
  userId: string,
  notifications: UserNotification[]
}
