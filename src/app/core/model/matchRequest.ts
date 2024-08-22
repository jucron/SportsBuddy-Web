import {Account} from "./account";

export interface MatchRequest {
  date: Date
  user: Account
  comment: string
}
