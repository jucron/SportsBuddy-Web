import {MatchRequest} from "./matchRequest";

export interface MatchRequestDecision {
  matchRequest: MatchRequest;
  accept: boolean
}
