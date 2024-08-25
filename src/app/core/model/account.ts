import {Sports} from "./sports";
import {UserNotification} from "./userNotification";

export interface Account {
  id: string,
  username: string,
  password: string,
  name: string,
  email: string,
  favouriteSports: Sports[],
  notifications: UserNotification[]
}
