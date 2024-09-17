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
}
