import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Credentials} from "../model/credentials";
import {Response} from "../model/response";
import {catchError, Observable} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {environment} from "../environments/environments";
import {MockResponseService} from "./mock-response.service";

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
    console.log(endpoint+' triggered from ApiService')
    if (environment.mockResponse) {
      return this.mockService.getLoginMockResponse();
    } else {
      return this.http.post<Response>(environment.baseUrl + endpoint, credentials)
        .pipe(
          catchError(this.handleError<Response>(endpoint))
        );
    }
  }

}

