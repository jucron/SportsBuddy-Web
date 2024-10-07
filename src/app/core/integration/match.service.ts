import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {Match} from "../model/match";
import {catchError, finalize, map, Observable, of} from "rxjs";
import {AlertService} from "../alert/alert.service";
import {MatchRequest} from "../model/requests/matchRequest";
import {DialogService} from "../dialog/dialog.service";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {MatchRequestDecision} from "../model/requests/matchRequestDecision";
import {ChatMessage} from "../model/chatMessage";
import {MessageType} from "../model/messageType";
import {MessageStatus} from "../model/messageStatus";
import {SendMatchRoomMessageRequest} from "../model/requests/sendMatchRoomMessageRequest";
import {ALERT_CACHE_KEYS} from "../keys/alert-cache-keys";
import {FormGroup} from "@angular/forms";
import {DateUtils} from "../utils/dateUtils";

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

  getMatches(): Observable<Match[] | null> {
    return this.apiService.getMatches().pipe(
      map(response => {
        return response;
      }),
      catchError(err => {
        console.error('getMatches failed', err);
        return of(null);
      }),
      finalize(() => {
      })
    );
  }

  matchRequest(matchRequestForm: FormGroup, loggedUserId: string, match: Match): Observable<boolean | null> {
    let matchRequest: MatchRequest = matchRequestForm.value;
    matchRequest.userIdRequested = loggedUserId;
    matchRequest.userNameRequested = 'to be filled';
    matchRequest.date = new Date();
    matchRequest.userIdOwner = match.owner!.id;

    return this.apiService.submitMatchRequest(matchRequest);
  }

  createMatch(matchForm: FormGroup) {
    const date = matchForm.get('date')?.value;
    const time = matchForm.get('time')?.value;
    const combinedDateTime = DateUtils.getCombinedDateTime(date,time);
    let match: Match = matchForm.value;
    match.date = combinedDateTime ?? match.date;

    return this.apiService.submitCreateMatch(match);
  }

  getMatch(matchId: string) {
    return this.apiService.getMatch(matchId);
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
  matchRequestDecision(matchRequestDecision: MatchRequestDecision) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();

    this.apiService.matchRequestDecision(matchRequestDecision)
      .subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.cacheAlert(ALERT_CACHE_KEYS.MATCH_REQUEST_DECISION_SUCCESS);
            this.routingService.reloadPage();
          } else {
            this.notificationService.alertMatchRequestDecisionFailed();
          }
        },
        error: err => {
          console.error('matchRequestDecision failed', err);
          this.notificationService.alertMatchRequestDecisionFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }

  sendMatchRoomMessage(matchId: string,senderId: string, message: ChatMessage) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
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
        map(response => {
          if (response) {
            this.notificationService.alertMatchRoomMessageSuccess();
            return response;
          } else {
            this.notificationService.alertMatchRoomMessageFailed();
            return null;
          }
        }),
        catchError(err => {
          console.error('getMatch failed', err);
          this.notificationService.alertGetMatchError();
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        })
      )
  }

  storeMatchId(response: string) {
    localStorage.setItem(STORAGE_KEYS.MY_MATCH_ID, response);
  }
}
