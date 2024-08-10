import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
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
            localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username)
            localStorage.setItem(STORAGE_KEYS.TOKEN, this.response.message)
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
  executeLogout() {
    localStorage.clear();
    this.apiService.redirectTo('', false);
  }
}
