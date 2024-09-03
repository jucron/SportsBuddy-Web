import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {MatchResponse} from "../model/responses/matchResponse";
import {Match} from "../model/match";
import {catchError, delay, finalize, map, Observable, of} from "rxjs";
import {AlertService} from "../alert/alert.service";
import {MatchRequest} from "../model/requests/matchRequest";
import {DialogService} from "../dialog/dialog.service";
import {HttpResponse} from "@angular/common/http";

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
      delay(1000),
      map(matchResponse => {
        if (matchResponse != null && matchResponse.message !== 'getMatches-failed') {
          return matchResponse;
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
      .pipe(delay(1000))
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response != null && response.status === 200) {
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
      .pipe(delay(1000))
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response != null && response.status === 200) {
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
}
