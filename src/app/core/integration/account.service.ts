import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/responses/loginResponse";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {RoutingService} from "../routing/routing.service";
import {Account} from "../model/account";
import {catchError, finalize, map, of} from "rxjs";
import {DialogService} from "../dialog/dialog.service";
import {AlertService} from "../alert/alert.service";
import {AuthService} from "../../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isLoading = false;
  response: LoginResponse | null = null;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private notificationService: AlertService,
    private loadingDialogService: DialogService,
    private authService: AuthService
  ) {}

  executeLogin(credentials: Credentials) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.executeLogin(credentials)
      .subscribe({
        next: response => {
          if (response) {
            localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username);
            localStorage.setItem(STORAGE_KEYS.MAIN_ID, response.userId);
            if (response.myMatchId) {
              localStorage.setItem(STORAGE_KEYS.MY_MATCH_ID, response.myMatchId);
            }
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
    this.authService.disconnect();

    //todo: call logout to backend
    this.routingService.redirectTo('', false);
  }
  createAccount(account: Account) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.createAccount(account)
      .subscribe({
        next: response => {
          if (response) {
            this.notificationService.alertCreateAccountSuccess();
            this.routingService.redirectTo('', false);
          } else {
            this.notificationService.alertCreateAccountFailed();
          }
        },
        error: err => {
          console.error('accountService.createAccount() failed', err);
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
      map(account => {
        if (account) {
          return account;
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
    return localStorage.getItem(STORAGE_KEYS.TOKEN) !== null;
  }

  getLoggedUsername() {
    return localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME)
  }

  getLoggedAccountId() {
    return localStorage.getItem(STORAGE_KEYS.MAIN_ID)
  }
}
