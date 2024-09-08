import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {MatchResponse} from "../model/responses/matchResponse";
import {Match} from "../model/match";
import {catchError, finalize, map, Observable, of} from "rxjs";
import {AlertService} from "../alert/alert.service";
import {MatchRequest} from "../model/requests/matchRequest";
import {DialogService} from "../dialog/dialog.service";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private notificationService: AlertService,
    private loadingDialogService: DialogService
  ) {
  }
  getMatches(): Observable<MatchResponse> {
    return this.apiService.getMatches().pipe(
      map(response => {
        if (response) {
          return response;
        } else {
          this.notificationService.alertGetMatchError();
          return this.getEmptyMatchResponse();
        }
      }),
      catchError(err => {
        console.error('getMatches failed', err);
        this.notificationService.alertGetMatchError();
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
      hasMatch: false
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
            this.notificationService.alertMatchRequestSuccess();
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
  getMyMatch() {
    return this.apiService.getMyMatch().pipe(
      map((myMatch) => {
        if (myMatch) {
          return myMatch;
        } else {
          this.notificationService.alertGetMyMatchError();
          return this.getEmptyMatch();
        }
      }),
      catchError(err => {
        console.error('getMyMatch failed', err);
        this.notificationService.alertGetMyMatchError();
        return of(this.getEmptyMatch());
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
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
      participants: []
    }
  }
}
