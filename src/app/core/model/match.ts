import {Account} from "./account";
import {MatchRequest} from "./requests/matchRequest";

export interface Match {
  id: string
  name: string
  date: Date
  location: string
  comments: string
  sport: string
  participants: Account[]
  owner: Account
  matchRequests: MatchRequest[]
}
