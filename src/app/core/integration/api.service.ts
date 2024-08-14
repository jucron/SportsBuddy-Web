import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Credentials} from "../model/credentials";
import {Response} from "../model/response";
import {catchError, Observable} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {environment} from "../environments/environments";
import {MockResponseService} from "./mock-response.service";
import {Account} from "../model/account";
import {MatchResponse} from "../model/matchResponse";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private handleError: HandleError;

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler,
              private mockService: MockResponseService) {
    this.handleError = httpErrorHandler.createHandleError('ApiService')
  }

  callLogin(credentials: Credentials): Observable<Response> {
    const endpoint = 'login';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.getLoginMockResponse(credentials);
    } else {
      return this.http.post<Response>(environment.baseUrl + endpoint, credentials)
        .pipe(
          catchError(this.handleError<Response>(endpoint))
        );
    }
  }

  createAccount(account: Account) {
    const endpoint = 'create-account';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.getCreateAccountMockResponse(account);
    } else {
      return this.http.post<Response>(environment.baseUrl + endpoint, account)
        .pipe(
          catchError(this.handleError<Response>(endpoint))
        );
    }
  }

  getMatches() {
    {
      const endpoint = 'get-matches';
      console.log(endpoint + ' triggered from ApiService')
      if (environment.mockResponse) {
        return this.mockService.getMockMatchResponse();
      } else {
        return this.http.get<MatchResponse>(environment.baseUrl + endpoint)
          .pipe(
            catchError(this.handleError<MatchResponse>(endpoint))
          );
      }
    }
  }
}

