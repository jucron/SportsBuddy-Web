import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/loginResponse";
import {Observable, of} from "rxjs";
import {Match} from "../model/match";
import {Account} from "../model/account";
import {Credentials} from "../model/credentials";
import {MatchResponse} from "../model/matchResponse";
import {AccountResponse} from "../model/accountResponse";

@Injectable({
  providedIn: 'root'
})
export class MockResponseService {
  accounts: Account[];
  mockMatches: Match[];
  accountMockId = 1;

  constructor() {
    this.accounts = this.bootstrapMockAccounts();
  this.mockMatches = this.bootstrapMockMatches();
  }

  getLoginMockResponse(credentials: Credentials): Observable<LoginResponse> {
    let mockResponse: LoginResponse = {
      id: '',
      token: '',
      message: 'login-failed' };
    let id = this.validateLoginAndReturnId(credentials.username, credentials.password);
    if (id) {
      mockResponse.id = id;
      mockResponse.token = 'mockValidToken';
      mockResponse.message = '';
    }
    return of(mockResponse);
  }

  private validateLoginAndReturnId(username: string, password: string): string | null {
    for (const credentials of this.accounts) {
      if (credentials.username === username) {
        if (credentials.password === password){
          return credentials.id;
        } else {
          //wrong pass for this user
          return null;
        }
      }
    }
    return null; // Username not found
  }

  getCreateAccountMockResponse(account: Account): Observable<LoginResponse> {
    this.accountMockId++;
    account.id = (this.accountMockId).toString();
    this.accounts.push(account);
    let mockResponse: LoginResponse = { id: '', token: '', message: 'account-created' };
    return of(mockResponse);
  }

  getMockMatchResponse(): Observable<MatchResponse> {
    const matchResponse = {
      message: 'getMatch-success',
      matches: this.mockMatches
    }
    return of(matchResponse);
  }
  private bootstrapMockMatches(): Match[] {
    return [
      {
        name: '3 on 3',
        date: '2021-11-21',
        hour: '16:00',
        location: 'Plaza sports center',
        comments: 'Bring all friends!',
        sport: 'basketball',
        owner: 'john',
        participants: 'larissa'
      },
      {
        name: 'Soccer relax',
        date: '2021-11-10',
        hour: '10:00',
        location: 'Main field',
        comments: 'I have the ball already, so just come =)',
        sport: 'soccer',
        owner: 'larry',
        participants: 'john, larissa'
      },
      {
        name: 'Tennis with friends',
        date: '2021-11-13',
        hour: '15:00',
        location: 'Tennis club',
        comments: 'Everyone is welcome!',
        sport: 'tennis',
        owner: 'larissa',
        participants: 'john, bruna'
      },
      {
        name: 'Beach Volleyball!',
        date: '2022-11-25',
        hour: '11:00',
        location: 'Long beach',
        comments: 'Were starting when we have 4',
        sport: 'volleyball',
        owner: 'bruna',
        participants: 'john, larry'
      }
    ];
  }
  private bootstrapMockAccounts(): Account[] {
    return [
      {id: '1', username: 'admin', password: 'admin', name: 'admin', email: 'admin@email.com', favouriteSports: []}
    ];
  }

  getAccountMockResponse(accountId: string) {
    let account = this.accounts.find(account => account.id === accountId);
    if (account == undefined) {
      account = this.accounts[1];
    }
    let accountResponse: AccountResponse = {
      message: 'account-found',
      account: account
    };
    return accountResponse;
  }
}
