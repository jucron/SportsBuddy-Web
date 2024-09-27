import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Credentials} from "../model/credentials";
import {LoginResponse} from "../model/responses/loginResponse";
import {catchError, map, Observable} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {environment} from "../environments/environments";
import {Account} from "../model/account";
import {MatchResponse} from "../model/responses/matchResponse";
import {AccountResponse} from "../model/responses/accountResponse";
import {MatchRequest} from "../model/requests/matchRequest";
import {NotificationsResponse} from "../model/responses/notificationsResponse";
import {UserNotification} from "../model/userNotification";
import {UpdateUserNotificationsRequest} from "../model/requests/updateUserNotificationsRequest";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {Match} from "../model/match";
import {CreateMatchRequest} from "../model/requests/createMatchRequest";
import {MyMatchResponse} from "../model/responses/myMatchResponse";
import {GenericResponse} from "../model/responses/genericResponse";
import {AuthService} from "../../auth/auth.service";
import {LoginRequest} from "../model/requests/loginRequest";
import {accountRequest} from "../model/requests/accountRequest";
import {MatchRequestDecision} from "../model/requests/matchRequestDecision";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //Note: status code outside the range of 200–299 causes an error response in Angular HttpClient
  private handleError: HandleError;

  constructor(private http: HttpClient,
              private authService: AuthService,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ApiService')
  }

  executeLogin(credentials: Credentials):  Observable<LoginResponse | null> {
    let loginRequest : LoginRequest = {credentials: credentials};
    const endpoint = 'login';
    console.log(endpoint + ' triggered from ApiService')
    return this.http.post<LoginResponse>(`${environment.baseUrl}${endpoint}`,
      loginRequest, {observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200 && response.body) {
            console.log('Login 200 ok');
            this.authService.storeToken(response.headers);
            return response.body;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  createAccount(account: Account):  Observable<boolean | null> {
    let createAccountRequest: accountRequest = {account: account};
    const endpoint = 'create-account';
    console.log(endpoint + ' triggered from ApiService')
    let headers = this.authService.getHeaderWithToken();
    return this.http.post<GenericResponse>(`${environment.baseUrl}${endpoint}`,
      createAccountRequest, {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 201) {
            console.log('Account 201 created');
            this.authService.storeToken(response.headers);
            return true;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  getMatches(): Observable<MatchResponse | null> {
    //todo: get matches with pagination
    const endpoint = 'get-matches';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.get<MatchResponse>(`${environment.baseUrl}${endpoint}`,
      {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200 && response.body) {
            console.log('getMatches 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  getAccount(accountId: string): Observable<Account | null>  {
    const endpoint = 'get-account';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.get<AccountResponse>(`${environment.baseUrl}${endpoint}/${accountId}`,
      {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200 && response.body) {
            console.log('getAccount 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body.account;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  submitMatchRequest(matchRequest: MatchRequest): Observable<boolean | null> {
    const endpoint = 'match-request';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.post<HttpResponse<GenericResponse>>(`${environment.baseUrl}${endpoint}`,
      matchRequest,{headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('submitMatchRequest 200 Ok');
            this.authService.storeToken(response.headers);
            return true;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  getUserNotifications(): Observable<UserNotification[] | null> {
    const accountId = localStorage.getItem(STORAGE_KEYS.MAIN_ID) ?? 'accountId_not_found_in_storage';
    const endpoint = 'get-user-notifications';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.get<NotificationsResponse>(`${environment.baseUrl}${endpoint}/${accountId}`,
      {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200 && response.body) {
            console.log('getUserNotifications 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body.userNotifications;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  updateUserNotifications(notifications: UserNotification[]): Observable<boolean | null>  {
    const accountId = localStorage.getItem(STORAGE_KEYS.MAIN_ID) ?? 'accountId_not_found_in_storage';
    const endpoint = 'update-user-notifications';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    let request: UpdateUserNotificationsRequest = {
      userId: accountId,
      notifications: notifications
    }
    return this.http.post<GenericResponse>(`${environment.baseUrl}${endpoint}`,
      request, {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('updateUserNotifications 200 Ok');
            this.authService.storeToken(response.headers);
            return true;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  submitCreateMatch(match: Match): Observable<string | null> {
    const accountId = localStorage.getItem(STORAGE_KEYS.MAIN_ID) ?? 'accountId_not_found_in_storage';
    const endpoint = 'create-match';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    let request: CreateMatchRequest = {
      userId: accountId,
      match: match
    }
    return this.http.post<GenericResponse>(`${environment.baseUrl}${endpoint}`,
      request, {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('submitCreateMatch 200 Ok');
            this.authService.storeToken(response.headers);
            if (response.body) {
              return response.body.message;
            }
            return null;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  getMatch(matchId: string): Observable<Match | null> {
    const endpoint = 'get-match';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.get<MyMatchResponse>(`${environment.baseUrl}${endpoint}/${matchId}`,
      {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200 && response.body) {
            console.log('getMatch 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body.myMatch;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  private handleUnexpectedResponse(response: HttpResponse<any>, endpoint: string) {
    const message = `Unexpected response status in ${endpoint} with status code: ${response.status}`;
    if (response.status > 299) {
      throw new HttpErrorResponse({
        headers: response.headers,
        status: response.status,
        url: response.url!,
        error: response,
        statusText: message
      });
    }
    console.log(message);
    return null;
  }
  updateAccount(account: Account) {
    let accountRequest: accountRequest = {account: account};
    const endpoint = 'update-account';
    console.log(endpoint + ' triggered from ApiService')
    let headers = this.authService.getHeaderWithToken();
    return this.http.patch<GenericResponse>(`${environment.baseUrl}${endpoint}`,
      accountRequest, {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('Account update 200 ok');
            this.authService.storeToken(response.headers);
            return true;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
  matchRequestDecision(matchRequestDecision: MatchRequestDecision): Observable<boolean | null> {
    const endpoint = 'match-request-decision';
    console.log(endpoint + ' triggered from ApiService')
    let headers = this.authService.getHeaderWithToken();
    return this.http.post<GenericResponse>(`${environment.baseUrl}${endpoint}`,
      matchRequestDecision, {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('matchRequestDecision 200 ok');
            this.authService.storeToken(response.headers);
            return true;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<null>(endpoint))
      );
  }
}

