import {Sports} from "./sports";
import {UserNotification} from "./userNotification";
import {Match} from "./match";

export interface Account {
  id: string,
  username: string,
  password: string,
  name: string,
  email: string,
  favouriteSports: Sports[],
  notifications: UserNotification[],
  myMatch: Match | null, //lazy loaded
  participatingMatches: Match[], //lazy loaded
}
