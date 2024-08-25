export interface UserNotification {
  id: string,
  type: string,
  message: string,
  date: Date,
  status: string,
  link: string
}
export enum NotificationStatus {
  // Notifications are in lifecycle order
  UNREAD = 'UNREAD',
  READ = 'READ',
  ACTIONED = 'ACTIONED',
  DISMISSED = 'DISMISSED',
  ARCHIVED = 'ARCHIVED',
}
