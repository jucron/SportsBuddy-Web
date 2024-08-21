import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/loginResponse";
import {Observable, of} from "rxjs";
import {Match} from "../model/match";
import {Account} from "../model/account";
import {Credentials} from "../model/credentials";
import {MatchResponse} from "../model/matchResponse";
import {AccountResponse} from "../model/accountResponse";
import {DateUtils} from "../utils/dateUtils";
import {Sports} from "../model/sports";

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
        date: this.getRandomDate(),
        location: 'Plaza sports center',
        comments: 'Bring all friends!',
        sport: Sports.basketball,
        owner: this.accounts[1],
        participants: [this.accounts[2],this.accounts[3]]
      },
      {
        name: 'Soccer relax',
        date: this.getRandomDate(),
        location: 'Main field',
        comments: 'I have the ball already, so just come =)',
        sport: Sports.soccer,
        owner: this.accounts[2],
        participants: [this.accounts[4],this.accounts[5]]
      },
      {
        name: 'Tennis with friends',
        date: this.getRandomDate(),
        location: 'Tennis club',
        comments: 'Everyone is welcome!',
        sport: Sports.tennis,
        owner: this.accounts[3],
        participants: [this.accounts[5],this.accounts[6],this.accounts[3]]
      },
      {
        name: 'Beach Volleyball!',
        date: this.getRandomDate(),
        location: 'Long beach',
        comments: 'Were starting when we have 4',
        sport: Sports.volleyball,
        owner: this.accounts[5],
        participants: [this.accounts[1],this.accounts[2],this.accounts[4]]
      }
    ];
  }
  private bootstrapMockAccounts(): Account[] {
    return [
      {id: '1', username: 'admin', password: 'admin', name: 'admin', email: 'admin@email.com', favouriteSports: []},
      {id: '2', username: 'john', password: '123', name: 'John Masters', email: 'john@email.com', favouriteSports: [Sports.baseball,Sports.soccer]},
      {id: '3', username: 'larissa', password: '123', name: 'Larissa Lurdes', email: 'larissa@email.com', favouriteSports: [Sports.basketball,Sports.soccer]},
      {id: '4', username: 'larissa', password: '123', name: 'Larissa Lurdes', email: 'larissa@email.com', favouriteSports: [Sports.tennis,Sports.volleyball]},
      {id: '5', username: 'rebecca', password: '123', name: 'Rebecca Lunes', email: 'rebecca@email.com', favouriteSports: [Sports.tennis,Sports.volleyball]},
      {id: '6', username: 'bruna', password: '123', name: 'Bruna Mello', email: 'bruna@email.com', favouriteSports: [Sports.soccer,Sports.baseball]},
      {id: '7', username: 'larry', password: '123', name: 'Larry London', email: 'larry@email.com', favouriteSports: [Sports.soccer,Sports.tennis,Sports.basketball,Sports.volleyball]}
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
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomDate(): Date {
    const hour = this.getRandomInt(6,24);
    const time= hour+':00';
    let daysInMillisecondsAheadFromNow = this.getRandomInt(1,15)* 24 * 60 * 60 * 1000;
    let dateFromFuture = new Date(new Date().getTime() + daysInMillisecondsAheadFromNow);
    return DateUtils.getCombinedDateTime(dateFromFuture,time) ?? new Date();
  }
}
