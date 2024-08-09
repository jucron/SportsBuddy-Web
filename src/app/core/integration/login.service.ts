import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private mainUsername_key = "mainUsername_key";
  private authToken_key = "authToken_key";
  isLoading = false;
  response: Response | null = null;

  constructor(
    private apiService: ApiService,
  ) {}

  executeLogin(credentials: Credentials) {
    this.apiService.callLogin(credentials)
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          console.log('Login successful', this.response);
          if (this.response != null) {
            localStorage.setItem(this.mainUsername_key, credentials.username)
            localStorage.setItem(this.authToken_key, this.response.message)
          }
          this.apiService.redirectTo('/home', false);
        },
        error: err => {
          console.error('Login failed', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
