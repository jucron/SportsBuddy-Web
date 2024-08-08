import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Credentials} from "../model/credentials";
import {Response} from "../model/response";
import {catchError, Observable, of} from "rxjs";
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {environment} from "../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:8080/api/v1";
  private handleError: HandleError;

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler,
              private router: Router) {
    this.handleError = httpErrorHandler.createHandleError('ApiService')
  }

  callLogin(credentials: Credentials): Observable<Response> {
    console.log('executeLogin triggered')
    if (environment.mockResponse) {
      const mockResponse: Response = { message: 'mockToken' };
      return of(mockResponse);
    } else {
    return this.http.post<Response>(this.baseUrl + 'login', credentials)
      .pipe(
        catchError(this.handleError<Response>('login'))
      );
  }
}


  redirectTo(uri:string, hideLocation: boolean){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri], {skipLocationChange: hideLocation}));
  }
}

