import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {MatchResponse} from "../model/matchResponse";
import {Match} from "../model/match";
import {catchError, delay, finalize, map, Observable, of} from "rxjs";
import {NotificationService} from "../notification/notification.service";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  isLoading = false;
  matchResponse: MatchResponse | null = null;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private notificationService: NotificationService
  ) {
  }

  getMatches(): Observable<Match[]> {
    return this.apiService.getMatches().pipe(
      delay(1000),
      map(observerResponse => {
        this.matchResponse = observerResponse;
        if (this.matchResponse != null && this.matchResponse.message !== 'getMatches-failed') {
          return  this.matchResponse.matches;
        } else {
          this.notificationService.notificationGetMatchError();
          return [];
        }
      }),
      catchError(err => {
        console.error('getMatches failed', err);
        this.notificationService.notificationGetMatchError();
        return of([]); // Return an empty array in case of error
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
}
