import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {RoutingService} from "../routing/routing.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatchResponse} from "../model/matchResponse";
import {Match} from "../model/match";
import {catchError, delay, finalize, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  isLoading = false;
  matchResponse: MatchResponse | null = null;
  notificationTimeMls = 15000;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private _snackBar: MatSnackBar
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
          this.notificationGetMatchError();
          return [];
        }
      }),
      catchError(err => {
        console.error('getMatches failed', err);
        this.notificationGetMatchError();
        return of([]); // Return an empty array in case of error
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  notificationGetMatchError() {
    const message = 'Some error was found while getting the Matches List, please try again later';
    this._snackBar.open(message, 'Ai ai ai!',{
      duration: this.notificationTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
}
