import {NotificationStatus, UserNotification} from "../model/userNotification";

export class NotificationFactory {

  constructor() {}
   createMatchRequestNotification(id: string): UserNotification {
     return {
         id: '1',
         link: `match-room/${id}/owner`,
         date: new Date(),
         type: 'account-participation',
         message: 'A new user wants to participate in your match!',
         status: NotificationStatus.UNREAD
       }
   }

  createMatchRequestAcceptedNotification(id: string) {
    return {
      id: '2',
      link: `match-room/${id}/participant`,
      date: new Date(),
      type: 'account-participation',
      message: 'Your match request has been accepted!',
      status: NotificationStatus.UNREAD
    }
  }
}
