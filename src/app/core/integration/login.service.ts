import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {catchError} from "rxjs";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private mainUsername_key = "mainUsername_key";
  private authToken_key = "authToken_key";

  constructor(
    private apiService: ApiService,
  ) {
  }

  executeLogin(credentials: Credentials) {
    let response: Response;
    this.apiService.callLogin(credentials)
      .subscribe(observerResponse =>(response = observerResponse));

    if (response == null) {
      alert("ERROR: account not found")
      //todo: handle username/password not correct (Security Impl)
    } else {
      localStorage.setItem(this.mainUsername_key, credentials.username)
      localStorage.setItem(this.authToken_key, response.subscribe())
      this.apiService.redirectTo('/home', false);
    }
  }
}
