import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/responses/loginResponse";
import {ApiService} from "./api.service";
import {Credentials} from "../model/credentials";
import {STORAGE_KEYS} from "../keys/storage-keys";
import {RoutingService} from "../routing/routing.service";
import {Account} from "../model/account";
import {catchError, map, Observable, of} from "rxjs";
import {DialogService} from "../dialog/dialog.service";
import {AlertService} from "../alert/alert.service";
import {AuthService} from "../../auth/auth.service";
import {IntegrationCallResponse} from "./ui-features/integration-call-response";
import {FormGroup} from "@angular/forms";
import {Sports} from "../model/sports";

function handleApiResponse(data: any, operationType: string): IntegrationCallResponse {
  if (!data) throw new Error('No data received');
  return IntegrationCallResponse.getSuccess(data, operationType);
}

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
    private dialogService: DialogService,
    private authService: AuthService
  ) {}

  executeLogin(loginForm: FormGroup): Observable<IntegrationCallResponse> {
    const opType = 'executeLogin';
    let credentials: Credentials = loginForm.value;
    return this.apiService.executeLogin(credentials)
      .pipe(
        map(data => {
          if (data) {
            this.storeLoginData(credentials, data);
            return handleApiResponse(true, opType);
          }
          return handleApiResponse(null, opType);
        }),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  private storeLoginData(credentials: Credentials,loginResponse: LoginResponse) {
    localStorage.setItem(STORAGE_KEYS.MAIN_USERNAME, credentials.username);
    localStorage.setItem(STORAGE_KEYS.MAIN_ID, loginResponse.userId);
    if (loginResponse.myMatchId) {
      localStorage.setItem(STORAGE_KEYS.MY_MATCH_ID, loginResponse.myMatchId);
    }
  }

  executeLogout() {
    this.authService.disconnect();

    //todo: call logout to backend
    this.routingService.redirectTo('', false);
  }

  createAccount(accountForm: FormGroup, sportsSelected: Sports[], currentAccountId: string): Observable<IntegrationCallResponse> {
    const opType = 'createAccount';

    let account: Account = accountForm.value;
    account.favouriteSports = sportsSelected;
    account.id = currentAccountId;

    return this.apiService.createAccount(account)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
        })
      );
  }

  getAccount(accountId: string): Observable<IntegrationCallResponse> {
    const opType = 'getAccount';

    return this.apiService.getAccount(accountId)
      .pipe(
        map(data => handleApiResponse(data, opType)),
        catchError(err => {
          console.error(`${opType} failed`, err);
          return of(IntegrationCallResponse.getFail(opType));
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

  updateAccount(account: Account) {
    this.isLoading = true;
    this.dialogService.showLoadingDialog();
    this.apiService.updateAccount(account)
      .subscribe({
        next: response => {
          if (response) {
            this.notificationService.alertUpdateAccountSuccess();
            this.routingService.redirectTo('', false);
          } else {
            this.notificationService.alertUpdateAccountFailed();
          }
        },
        error: err => {
          console.error('accountService.createAccount() failed', err);
          this.notificationService.alertUpdateAccountFailed();
        },
        complete: () => {
          this.isLoading = false;
          this.dialogService.closeLoadingDialog();
        }
      });
  }


}
