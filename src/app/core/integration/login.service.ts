import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/loginResponse";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {RoutingService} from "../routing/routing.service";
import {Account} from "../model/account";
import {catchError, delay, finalize, map, of} from "rxjs";
import {LoadingDialogService} from "../helper-components/loading-dialog/loading-dialog.service";
import {NotificationService} from "../notification/notification.service";
import {AccountResponse} from "../model/accountResponse";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoading = false;
  response: LoginResponse | null = null;
  accountResponse: AccountResponse | null = null;

  constructor(
    private apiService: ApiService,
    private routingService: RoutingService,
    private notificationService: NotificationService,
    private loadingDialogService: LoadingDialogService
  ) {}

  executeLogin(credentials: Credentials) {
    this.isLoading = true;
    this.loadingDialogService.showLoadingDialog();
    this.apiService.callLogin(credentials)
      .pipe(delay(2000))
      .subscribe({
        next: observerResponse => {
          this.response = observerResponse;
          console.log('Login successful', this.response);
          if (this.response != null && this.response.message != 'login-failed') {
            localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username);
            localStorage.setItem(STORAGE_KEYS.TOKEN, this.response.token);
            localStorage.setItem(STORAGE_KEYS.MAIN_ID, this.response.id);
            this.notificationService.notificationLoginSuccessfully();
            this.routingService.redirectTo('home', false);
          } else {
            this.notificationService.notificationLoginFailed();
          }
        },
        error: err => {
          console.error('Login failed', err);
          this.notificationService.notificationLoginFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.loadingDialogService.closeLoadingDialog();
        }
      });
  }
  executeLogout() {
    localStorage.clear();
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
            this.notificationService.notificationCreateAccountSuccessfully();
            this.routingService.redirectTo('', false);
          } else {
            this.notificationService.notificationCreateAccountFailed();
          }
        },
        error: err => {
          console.error('createAccount failed', err);
          this.notificationService.notificationCreateAccountFailed();
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
          this.notificationService.notificationGetAccountFailed();
          return null;
        }
      }),
      catchError(err => {
        console.error('getAccount failed', err);
        this.notificationService.notificationGetAccountFailed();
        return of(null); // Return null on error
      }),
      finalize(() => {
        this.isLoading = false;
        this.loadingDialogService.closeLoadingDialog();
      })
    );
  }

}
