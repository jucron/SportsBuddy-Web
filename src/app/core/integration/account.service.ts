import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/responses/loginResponse";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {RoutingService} from "../routing/routing.service";
import {Account} from "../model/account";
import {catchError, delay, finalize, map, of} from "rxjs";
import {DialogService} from "../dialog/dialog.service";
import {AlertService} from "../alert/alert.service";
import {AccountResponse} from "../model/responses/accountResponse";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isLoading = false;
  response: LoginResponse | null = null;
  accountResponse: AccountResponse | null = null;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private notificationService: AlertService,
    private loadingDialogService: DialogService
  ) {}

  executeLogin(credentials: Credentials) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.executeLogin(credentials)
      .pipe(delay(2000))
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          console.log('Login successful', this.response);
          if (this.response != null && this.response.message != 'login-failed') {
            localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username);
            localStorage.setItem(STORAGE_KEYS.TOKEN, this.response.token);
            localStorage.setItem(STORAGE_KEYS.MAIN_ID, this.response.id);
            this.notificationService.alertLoginSuccess();
            this.routingService.redirectTo('home', false);
          } else {
            this.notificationService.alertLoginFailed();
          }
        },
        error: err => {
          console.error('Login failed', err);
          this.notificationService.alertLoginFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }
  executeLogout() {
    localStorage.clear();
    //todo: call logout to backend
    this.routingService.redirectTo('', false);
  }
  createAccount(account: Account) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.createAccount(account)
      .pipe(delay(2000))
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          if (this.response != null && this.response.message === 'account-created') {
            this.notificationService.alertCreateAccountSuccess();
            this.routingService.redirectTo('', false);
          } else {
            this.notificationService.alertCreateAccountFailed();
          }
        },
        error: err => {
          console.error('createAccount failed', err);
          this.notificationService.alertCreateAccountFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }

  getAccount(accountId: string) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    return this.apiService.getAccount(accountId).pipe(
      delay(1000),
      map(observerResponse => {
        this.accountResponse = observerResponse;
        if (this.accountResponse && this.accountResponse.message === 'account-found') {
          return this.accountResponse.account;
        } else {
          this.notificationService.alertGetAccountFailed();
          return null;
        }
      }),
      catchError(err => {
        console.error('getAccount failed', err);
        this.notificationService.alertGetAccountFailed();
        return of(null); // Return null on error
      }),
      finalize(() => {
        this.isLoading = false;
        this.loadingDialogService.closeLoadingDialog();
      })
    );
  }

  isAuthenticated() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) != null;
  }
}
