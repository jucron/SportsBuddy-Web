import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {RoutingService} from "../routing/routing.service";
import {Account} from "../model/account";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoading = false;
  response: Response | null = null;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService
  ) {}

  executeLogin(credentials: Credentials) {
    this.apiService.callLogin(credentials)
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          console.log('Login successful', this.response);
          if (this.response != null && this.response.message != 'login-failed') {
            localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username)
            localStorage.setItem(STORAGE_KEYS.TOKEN, this.response.message)
          }
          this.routingService.redirectTo('home', false);
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
    this.routingService.redirectTo('', false);
  }

  createAccount(account: Account) {
    this.apiService.createAccount(account)
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          if (this.response != null && this.response.message === 'account-created') {
            //todo: create a field to inform that account was created successful
          }
          this.routingService.redirectTo('', false);
        },
        error: err => {
          console.error('createAccount failed', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
