import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {MatchResponse} from "../model/responses/matchResponse";
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
  getMatches(): Observable<MatchResponse> {
    return this.apiService.getMatches().pipe(
      map(response => {
        if (response) {
          return response;
        } else {
          this.notificationService.alertGetMatchesError();
          return this.getEmptyMatchResponse();
        }
      }),
      catchError(err => {
        console.error('getMatches failed', err);
        this.notificationService.alertGetMatchesError();
        return of(this.getEmptyMatchResponse());
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
  private getEmptyMatchResponse(): MatchResponse {
    return {
      message: 'getMatches-failed',
      matches: [],
    };
  }
  matchRequest(matchRequest: MatchRequest) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.submitMatchRequest(matchRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.alertMatchRequestSuccess();
            this.routingService.redirectTo('home', false);
          } else {
            this.notificationService.alertMatchRequestFailed();
          }
        },
        error: err => {
          console.error('matchRequest failed', err);
          this.notificationService.alertMatchRequestFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }
  createMatch(match: Match) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.submitCreateMatch(match)
      .subscribe({
        next: (response) => {
          if (response) {
            localStorage.setItem(STORAGE_KEYS.MY_MATCH_ID, response);
            this.notificationService.alertCreateMatchSuccess();
            this.routingService.redirectTo('home', false);
          } else {
            this.notificationService.alertCreateMatchFailed();
          }
        },
        error: err => {
          console.error('matchRequest failed', err);
          this.notificationService.alertCreateMatchFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }
  private getEmptyMatch(): Match {
    return  {
      id: '-1',
      name: 'No Match',
      date: new Date(),
      location: 'No Match',
      matchRequests: [],
      sport: 'No Match',
      comments: 'No Match',
      participants: [],
      chatData: null
    }
  }
  getMatch(id: string) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    return this.apiService.getMatch(id).pipe(
      map((match) => {
        if (match) {
          return match;
        } else {
          this.notificationService.alertGetMatchError();
          return this.getEmptyMatch();
        }
      }),
      catchError(err => {
        console.error('getMatch failed', err);
        this.notificationService.alertGetMatchError();
        return of(this.getEmptyMatch());
      }),
      finalize(() => {
        this.isLoading = false;
        this.loadingDialogService.closeLoadingDialog();
      })
    );
  }
  getMyMatchLabel() {
    let myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
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
    this.apiService.sendMatchRoomMessage(sendMatchRoomMessageRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.cacheAlert(ALERT_CACHE_KEYS.MATCH_ROOM_MESSAGE_SUCCESS);
            this.routingService.reloadPage();
          } else {
            this.notificationService.alertMatchRoomMessageFailed();
          }
        },
        error: err => {
          console.error('sendMatchRoomMessage failed', err);
          this.notificationService.alertMatchRoomMessageFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }
}
