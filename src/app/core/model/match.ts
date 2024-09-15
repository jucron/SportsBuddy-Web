import {Account} from "./account";
import {MatchRequest} from "./requests/matchRequest";
import {ChatData} from "./chatData";

export interface Match {
  id: string
  name: string
  date: Date
  location: string
  comments: string
  sport: string
  participants: Account[]
  owner?: Account | null
  matchRequests: MatchRequest[]
  chatData: ChatData | null
}
