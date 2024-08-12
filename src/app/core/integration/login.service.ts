import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {RoutingService} from "../routing/routing.service";
import {Account} from "../model/account";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoading = false;
  response: Response | null = null;
  notificationTimeMls = 15000;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private _snackBar: MatSnackBar
  ) {}

  executeLogin(credentials: Credentials) {
    this.apiService.callLogin(credentials)
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          console.log('Login successful', this.response);
          if (this.response != null && this.response.message != 'login-failed') {
            localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username);
            localStorage.setItem(STORAGE_KEYS.TOKEN, this.response.message);
            this.notificationLoginSuccessfully();
            this.routingService.redirectTo('home', false);
          } else {
            this.notificationLoginFailed();
          }
        },
        error: err => {
          console.error('Login failed', err);
          this.notificationLoginFailed();
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
            this.notificationCreateAccountSuccessfully();
            this.routingService.redirectTo('', false);
          } else {
            this.notificationCreateAccountFailed();
          }
        },
        error: err => {
          console.error('createAccount failed', err);
          this.notificationCreateAccountFailed();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  notificationCreateAccountSuccessfully() {
    const message = 'New account created successfully!';
    this._snackBar.open(message, 'Nice!',{
      duration: this.notificationTimeMls,
      panelClass: ['success-snackbar']
    });
  }
  notificationCreateAccountFailed() {
    const message = 'Some error was found while creating the new account, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.notificationTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  notificationLoginSuccessfully() {
    const message = 'Welcome! 😁';
    this._snackBar.open(message, 'Great!',{
      duration: this.notificationTimeMls,
      panelClass: ['success-snackbar']
    });
  }
  notificationLoginFailed() {
    const message = 'Login failed.. 😔';
    this._snackBar.open(message, 'Oh no!',{
      duration: this.notificationTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
}
