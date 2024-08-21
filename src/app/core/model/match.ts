import {Account} from "./account";

export interface Match {
  id: string,
  name: string,
  date: Date,
  location: string,
  comments: string,
  sport: string,
  participants: Account[],
  owner: Account
}
