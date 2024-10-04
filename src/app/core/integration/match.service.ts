import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {Match} from "../model/match";
import {catchError, map, Observable, of} from "rxjs";
import {AlertService} from "../alert/alert.service";
import {MatchRequest} from "../model/requests/matchRequest";
import {DialogService} from "../dialog/dialog.service";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {MatchRequestDecision} from "../model/requests/matchRequestDecision";
import {ChatMessage} from "../model/chatMessage";
import {MessageType} from "../model/messageType";
import {MessageStatus} from "../model/messageStatus";
import {SendMatchRoomMessageRequest} from "../model/requests/sendMatchRoomMessageRequest";
import {FormGroup} from "@angular/forms";
import {DateUtils} from "../utils/dateUtils";
import {IntegrationCallResponse} from "./ui-features/integration-call-response";

function handleApiResponse(data: any, operationType: string): IntegrationCallResponse {
  if (!data) throw new Error('No data received');
  return IntegrationCallResponse.getSuccess(data, operationType);
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private notificationService: AlertService,
    private loadingDialogService: DialogService,
  ) {
  }

  getMatches(): Observable<IntegrationCallResponse> {
    const opType = 'getMatches';
    return this.apiService.getMatches()
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  matchRequest(matchRequestForm: FormGroup, loggedUserId: string, match: Match): Observable<IntegrationCallResponse> {
    const opType = 'matchRequest';

    let matchRequest: MatchRequest = matchRequestForm.value;
    matchRequest.userIdRequested = loggedUserId;
    matchRequest.userNameRequested = 'to be filled';
    matchRequest.date = new Date();
    matchRequest.userIdOwner = match.owner!.id;

    return this.apiService.submitMatchRequest(matchRequest)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  createMatch(matchForm: FormGroup): Observable<IntegrationCallResponse> {
    const opType = 'createMatch';
    const date = matchForm.get('date')?.value;
    const time = matchForm.get('time')?.value;
    const combinedDateTime = DateUtils.getCombinedDateTime(date,time);
    let match: Match = matchForm.value;
    match.date = combinedDateTime ?? match.date;

    return this.apiService.submitCreateMatch(match)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  getMatch(matchId: string): Observable<IntegrationCallResponse> {
    const opType = 'getMatch';
    return this.apiService.getMatch(matchId)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  getMyMatchId() {
    return localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
  }

  getMyMatchLabel() {
    let myMatchId = this.getMyMatchId();
    if (myMatchId) {
      return "Go to my Match-Room";
    }
    return "Create a new Match";
  }

  matchRequestDecision(matchRequest: MatchRequest, accept: boolean): Observable<IntegrationCallResponse> {
    const opType = 'matchRequestDecision';
    let matchRequestDecision: MatchRequestDecision = {matchRequest, accept};
    return this.apiService.matchRequestDecision(matchRequestDecision)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  sendMatchRoomMessage(matchId: string,senderId: string, message: ChatMessage): Observable<IntegrationCallResponse> {
    const opType = 'sendMatchRoomMessage';
    // Set message properties
    message.type = MessageType.TEXT;
    message.status = MessageStatus.SENT;
    // Set request properties
    let sendMatchRoomMessageRequest: SendMatchRoomMessageRequest = {
      matchId: matchId,
      senderId: senderId,
      message: message
    }
    //Call API
    return this.apiService.sendMatchRoomMessage(sendMatchRoomMessageRequest)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  storeMatchId(response: string) {
    localStorage.setItem(STORAGE_KEYS.MY_MATCH_ID, response);
  }
}
