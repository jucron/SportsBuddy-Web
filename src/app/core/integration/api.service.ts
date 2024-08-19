import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Credentials} from "../model/credentials";
import {LoginResponse} from "../model/loginResponse";
import {catchError, Observable, of} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {environment} from "../environments/environments";
import {MockResponseService} from "./mock-response.service";
import {Account} from "../model/account";
import {MatchResponse} from "../model/matchResponse";
import {AccountResponse} from "../model/accountResponse";

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

  callLogin(credentials: Credentials): Observable<LoginResponse> {
    const endpoint = 'login';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.getLoginMockResponse(credentials);
    } else {
      return this.http.post<LoginResponse>(environment.baseUrl + endpoint, credentials)
        .pipe(
          catchError(this.handleError<LoginResponse>(endpoint))
        );
    }
  }

  createAccount(account: Account) {
    const endpoint = 'create-account';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.getCreateAccountMockResponse(account);
    } else {
      return this.http.post<LoginResponse>(environment.baseUrl + endpoint, account)
        .pipe(
          catchError(this.handleError<LoginResponse>(endpoint))
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

  getAccount(accountId: string)  {
    const endpoint = 'get-account';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      let accountResponse = this.mockService.getAccountMockResponse(accountId);
      return of(accountResponse);
    } else {
      return this.http.get<AccountResponse>(environment.baseUrl + endpoint+'/'+accountId)
        .pipe(
          catchError(this.handleError<AccountResponse>(endpoint))
        );
    }
  }
}

