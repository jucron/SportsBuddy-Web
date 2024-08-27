import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Credentials} from "../model/credentials";
import {LoginResponse} from "../model/responses/loginResponse";
import {catchError, Observable, of} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {environment} from "../environments/environments";
import {MockResponseService} from "./mock-response.service";
import {Account} from "../model/account";
import {MatchResponse} from "../model/responses/matchResponse";
import {AccountResponse} from "../model/responses/accountResponse";
import {MatchRequest} from "../model/requests/matchRequest";
import {NotificationsResponse} from "../model/responses/notificationsResponse";
import {UserNotification} from "../model/userNotification";
import {UpdateUserNotificationsRequest} from "../model/requests/updateUserNotificationsRequest";
import {STORAGE_KEYS} from "../keys/storage-keys";

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

  executeLogin(credentials: Credentials): Observable<LoginResponse> {
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

  submitMatchRequest(matchRequest: MatchRequest) {
    const endpoint = 'match-request';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.mockMatchRequestResponse(matchRequest);
    } else {
      return this.http.post<HttpResponse<null>>(environment.baseUrl + endpoint, matchRequest, { observe: 'response' })
        .pipe(
          catchError(this.handleError<HttpResponse<null>>(endpoint))
        );
    }
  }

  getUserNotifications() {
    const accountId = localStorage.getItem(STORAGE_KEYS.MAIN_ID) ?? 'accountId_not_found_in_storage';
    const endpoint = 'get-user-notifications';
    console.log(endpoint + ' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.getMockUserNotificationsResponse(accountId);
    } else {
      return this.http.get<NotificationsResponse>(environment.baseUrl + endpoint+'/'+accountId)
        .pipe(
          catchError(this.handleError<NotificationsResponse>(endpoint))
        );
    }
  }

  updateUserNotifications(notifications: UserNotification[]) {
    const accountId = localStorage.getItem(STORAGE_KEYS.MAIN_ID) ?? 'accountId_not_found_in_storage';
    const endpoint = 'update-user-notifications';
    console.log(endpoint + ' triggered from ApiService')
    let request: UpdateUserNotificationsRequest = {
      userId: accountId,
      notifications: notifications
    }
    if (environment.mockResponse) {
      return this.mockService.mockUpdateUserNotificationsResponse(request);
    } else {
      return this.http.post<HttpResponse<null>>(environment.baseUrl + endpoint, request, { observe: 'response' })
        .pipe(
          catchError(this.handleError<HttpResponse<null>>(endpoint))
        );
    }
  }
}

