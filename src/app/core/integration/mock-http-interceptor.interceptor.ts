import {HttpHeaders, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {environment} from "../environments/environments";
import {MockResponseService} from "./mock-response.service";
import {inject} from "@angular/core";
import {delay, of} from "rxjs";
import {MatchRequest} from "../model/requests/matchRequest";
import {UpdateUserNotificationsRequest} from "../model/requests/updateUserNotificationsRequest";
import {CreateMatchRequest} from "../model/requests/createMatchRequest";
import {GenericResponse} from "../model/responses/genericResponse";
import {LoginResponse} from "../model/responses/loginResponse";
import {MatchResponse} from "../model/responses/matchResponse";
import {AccountResponse} from "../model/responses/accountResponse";
import {NotificationsResponse} from "../model/responses/notificationsResponse";
import {MyMatchResponse} from "../model/responses/myMatchResponse";
import {UrlHelper} from "../helper-components/urlHelper";
import {LoginRequest} from "../model/requests/loginRequest";
import {accountRequest} from "../model/requests/accountRequest";
import {MatchRequestDecision} from "../model/requests/matchRequestDecision";

export const mockHttpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const mockService = inject(MockResponseService);
  let mockResponse: HttpResponse<any> | null = null;
  const validToken = mockService.getCurrentMockJWT();
  let isValidTokenFromRequest = false;
  let isEndpointSecured = true; //by default, all endpoints are secured

  console.log('mockHttpInterceptorInterceptor triggered');

  if (!environment.isActiveMockResponse) {
    return next(req);
  }
  //Mock auth verification from backend
  let tokenFromRequest = req.headers.get('Authorization');
  if (tokenFromRequest && tokenFromRequest.startsWith('Bearer ')) {
      isValidTokenFromRequest = (tokenFromRequest === validToken);
  }

  if (req.url.endsWith('/login')) {
    isEndpointSecured = false; //login is not secured
    let responseBody: LoginResponse = mockService.getLoginMockResponse(req.body as LoginRequest)
    const success = responseBody.message !== 'login-failed';
    let headers = new HttpHeaders({'Authorization': (success) ? validToken : 'broken-token'});
    mockResponse = new HttpResponse({
      headers: headers,
      status: (success) ? 200: 401, //Ok or Unauthorized
      body: responseBody as LoginResponse
    });
  } else if (req.url.endsWith('/create-account')) {
    isEndpointSecured = false; //create-account is not secured
    let responseBody: GenericResponse = mockService.getCreateAccountMockResponse(req.body as accountRequest);
    const success = responseBody.message !== 'username-taken';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 201: 409, //Created or Conflict
      body: responseBody as GenericResponse
    });
  } else if (req.url.endsWith('/update-account')) {
    let responseBody: GenericResponse = mockService.getUpdateAccountMockResponse(req.body as accountRequest);
    const success = responseBody.message === 'account-updated';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200 : 404, //OK or Not found
      body: responseBody as GenericResponse
    });
  } else if (req.url.endsWith('/get-matches')) {
    let responseBody: MatchResponse = mockService.getMockMatchesResponse();
    const success = responseBody.message === 'getMatch-success';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as MatchResponse
    });
  } else if (req.url.includes('/get-account')) {
    let responseBody: AccountResponse = mockService.getAccountMockResponse(UrlHelper.getLastElementFromUrl(req.url))
    const success = responseBody.message === 'account-found';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as AccountResponse
    });
  } else if (req.url.endsWith('/match-request')) {
    let responseBody: GenericResponse = mockService.mockMatchRequestResponse(req.body as MatchRequest);
    const success = responseBody.message === 'match-request-sent';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as GenericResponse
    });
  } else if (req.url.endsWith('/match-request-decision')) {
    let responseBody: GenericResponse = mockService.mockMatchRequestDecisionResponse(req.body as MatchRequestDecision);
    const success = responseBody.message === 'match-request-decision-processed';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as GenericResponse
    });
  } else if (req.url.includes('/get-user-notifications')) {
    let responseBody: NotificationsResponse = mockService.getMockUserNotificationsResponse(UrlHelper.getLastElementFromUrl(req.url));
    const success = responseBody.message === 'notifications-found';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as NotificationsResponse
    });
  } else if (req.url.endsWith('/update-user-notifications')) {
    let responseBody: GenericResponse = mockService.mockUpdateUserNotificationsResponse(req.body as UpdateUserNotificationsRequest)
    const success = responseBody.message === 'notifications-updated';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as GenericResponse
    });
  } else if (req.url.endsWith('/create-match')) {
    let responseBody: GenericResponse = mockService.mockCreateMatchResponse(req.body as CreateMatchRequest)
    const success = responseBody.message !== 'create match failed';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as GenericResponse
    });
  } else if (req.url.includes('/get-match')) {
    let responseBody: MyMatchResponse = mockService.getMockMatchResponse(UrlHelper.getLastElementFromUrl(req.url));
    const success = responseBody.message === 'match-found';
    mockResponse = new HttpResponse({
      headers: new HttpHeaders({'Authorization': validToken}),
      status: (success) ? 200: 404, //OK or Not found
      body: responseBody as MyMatchResponse
    });
  }

  if (isEndpointSecured) {
    if (!isValidTokenFromRequest) {
      return of(new HttpResponse({
        status: 403 //return 403 Forbidden
      }))
        .pipe(delay(environment.mockDelay_ms));
    }
  }
  if (mockResponse) {
    //return the mock response with a delay
    return of(mockResponse)
      .pipe(delay(environment.mockDelay_ms));
  }
  return next(req);
};
