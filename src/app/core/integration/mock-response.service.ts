import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {Observable, of} from "rxjs";
import {Match} from "../model/match";
import {Account} from "../model/account";
import {Credentials} from "../model/credentials";
import {MatchResponse} from "../model/matchResponse";

@Injectable({
  providedIn: 'root'
})
export class MockResponseService {
  accounts: Account[];
  mockMatches: Match[];

  constructor() {
    this.accounts = this.bootstrapMockAccounts();
  this.mockMatches = this.bootstrapMockMatches();
  }

  getLoginMockResponse(credentials: Credentials): Observable<Response> {
    let mockResponse: Response = { message: 'login-failed' };
    if (this.validateLogin(credentials.username, credentials.password)) {
      mockResponse = { message: 'mockValidToken' };
    }
    return of(mockResponse);
  }

  private validateLogin(username: string, password: string) {
    for (const credentials of this.accounts) {
      if (credentials.username === username) {
        return credentials.password === password;
      }
    }
    return false; // Username not found
  }

  getCreateAccountMockResponse(account: Account): Observable<Response> {
    this.accounts.push(account);
    let mockResponse: Response = { message: 'account-created' };
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
  private bootstrapMockAccounts() {
    return [
      {username: 'admin', password: 'admin', name: 'admin', email: 'admin@email.com', favouriteSports: []}
    ];
  }
}
