import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
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
import {AuthService} from "./auth.service";
import {LoginRequest} from "../model/requests/loginRequest";
import {CreateAccountRequest} from "../model/requests/createAccountRequest";

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
          if (response.status === 200) {
            console.log('Login 200 ok');
            this.authService.storeToken(response.headers);
            return response.body;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<HttpResponse<LoginResponse>>(endpoint)),
        map(()=> null)
      );
  }
  createAccount(account: Account):  Observable<boolean | null> {
    let createAccountRequest: CreateAccountRequest = {account: account};
    const endpoint = 'create-account';
    console.log(endpoint + ' triggered from ApiService')
    let headers = this.authService.getHeaderWithToken();
    return this.http.post<HttpResponse<GenericResponse>>(`${environment.baseUrl}${endpoint}`,
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
        catchError(this.handleError<HttpResponse<GenericResponse>>(endpoint)),
        map(()=> null)
      );
  }
  getMatches(): Observable<MatchResponse | null> {
    const endpoint = 'get-matches';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.get<HttpResponse<MatchResponse>>(`${environment.baseUrl}${endpoint}`,
      {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('getMatches 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<HttpResponse<MatchResponse>>(endpoint)),
        map(()=> null)
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
          if (response.status === 200) {
            console.log('getAccount 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body!.account;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<HttpResponse<AccountResponse>>(endpoint)),
        map(()=> null)
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
        catchError(this.handleError<HttpResponse<AccountResponse>>(endpoint)),
        map(()=> null)
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
          if (response.status === 200) {
            console.log('getUserNotifications 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body?.userNotifications;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<HttpResponse<NotificationsResponse>>(endpoint)),
        map(()=> null)
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
        catchError(this.handleError<HttpResponse<GenericResponse>>(endpoint)),
        map(()=> null)
      );
  }
  submitCreateMatch(match: Match): Observable<boolean | null> {
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
            return true;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<HttpResponse<GenericResponse>>(endpoint)),
        map(()=> null)
      );
  }
  getMyMatch(): Observable<Match | null> {
    const accountId = localStorage.getItem(STORAGE_KEYS.MAIN_ID) ?? 'accountId_not_found_in_storage';
    const endpoint = 'get-my-match';
    console.log(endpoint + ' triggered from ApiService');
    let headers = this.authService.getHeaderWithToken();
    return this.http.get<MyMatchResponse>(`${environment.baseUrl}${endpoint}/${accountId}`,
      {headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            console.log('getMyMatch 200 Ok');
            this.authService.storeToken(response.headers);
            return response.body?.myMatch;
          }
          return this.handleUnexpectedResponse(response, endpoint);
        }),
        catchError(this.handleError<HttpResponse<MyMatchResponse>>(endpoint)),
        map(()=> null)
      );
  }

  private handleUnexpectedResponse(response: HttpResponse<any>, endpoint: string) {
    const message = `Unexpected response status in ${endpoint} with status code: ${response.status}`;
    console.log(message);
    throw new Error(message);
  }
}

