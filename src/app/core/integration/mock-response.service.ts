import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/responses/loginResponse";
import {Observable, of} from "rxjs";
import {Match} from "../model/match";
import {Account} from "../model/account";
import {Credentials} from "../model/credentials";
import {MatchResponse} from "../model/responses/matchResponse";
import {AccountResponse} from "../model/responses/accountResponse";
import {DateUtils} from "../utils/dateUtils";
import {Sports} from "../model/sports";
import {MatchRequest} from "../model/requests/matchRequest";
import {HttpResponse} from "@angular/common/http";
import {NotificationsResponse} from "../model/responses/notificationsResponse";
import {UpdateUserNotificationsRequest} from "../model/requests/updateUserNotificationsRequest";
import {FactoryService} from "../factory/factory.service";
import {UserNotification} from "../model/userNotification";
import {CreateMatchRequest} from "../model/requests/createMatchRequest";
import {v4 as uuidv4} from 'uuid';
import {STORAGE_KEYS} from "../keys/storage-keys";
import {MyMatchResponse} from "../model/responses/myMatchResponse";

@Injectable({
  providedIn: 'root'
})
export class MockResponseService {
  accounts: Account[] = [];
  matches: Match[] = [];
  accountMockId = 1;
  accountKeys = 'account-keys';
  matchesKeys = 'matches-keys';

  constructor(private factoryService: FactoryService) {
    this.loadData();
  }

  getLoginMockResponse(credentials: Credentials): Observable<LoginResponse> {
    let mockResponse: LoginResponse = {
      id: '',
      token: '',
      message: 'login-failed'
    };
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
        if (credentials.password === password) {
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
    //create new account
    this.accountMockId++;
    account.id = (this.accountMockId).toString();
    this.accounts.push(account);
    //save mockUp data
    this.saveData();
    //response
    let mockResponse: LoginResponse = {id: '', token: '', message: 'account-created'};
    return of(mockResponse);
  }

  getMockMatchesResponse(): Observable<MatchResponse> {
    //backend note: the username will be taken from the JWT token
    const hasMatch = this.matches.some(match => match.owner?.username == localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME));
    const matchResponse = {
      message: 'getMatch-success',
      matches: this.matches,
      hasMatch: hasMatch
    }
    return of(matchResponse);
  }

  private bootstrapMockMatches(): Match[] {
    return [
      {
        id: '1',
        name: '3 on 3',
        date: this.getRandomDate(),
        location: 'Plaza sports center',
        comments: 'Bring all friends!',
        sport: Sports.basketball,
        owner: this.accounts[1],
        participants: [this.accounts[2], this.accounts[3]],
        matchRequests: []
      },
      {
        id: '2',
        name: 'Soccer relax',
        date: this.getRandomDate(),
        location: 'Main field',
        comments: 'I have the ball already, so just come =)',
        sport: Sports.soccer,
        owner: this.accounts[2],
        participants: [this.accounts[4], this.accounts[5]],
        matchRequests: []
      },
      {
        id: '3',
        name: 'Tennis with friends',
        date: this.getRandomDate(),
        location: 'Tennis club',
        comments: 'Everyone is welcome!',
        sport: Sports.tennis,
        owner: this.accounts[3],
        participants: [this.accounts[5], this.accounts[6], this.accounts[3]],
        matchRequests: []
      },
      {
        id: '4',
        name: 'Beach Volleyball!',
        date: this.getRandomDate(),
        location: 'Long beach',
        comments: 'Were starting when we have 4',
        sport: Sports.volleyball,
        owner: this.accounts[5],
        participants: [this.accounts[1], this.accounts[2], this.accounts[4]],
        matchRequests: []
      }
    ];
  }

  private bootstrapMockAccounts(): Account[] {
    return [
      {
        id: '1',
        username: 'admin',
        password: 'admin',
        name: 'admin',
        email: 'admin@email.com',
        favouriteSports: [],
        notifications: []
      },
      {
        id: '2',
        username: 'john',
        password: '123',
        name: 'John Masters',
        email: 'john@email.com',
        favouriteSports: [Sports.baseball, Sports.soccer],
        notifications: []
      },
      {
        id: '3',
        username: 'larissa',
        password: '123',
        name: 'Larissa Lurdes',
        email: 'larissa@email.com',
        favouriteSports: [Sports.basketball, Sports.soccer],
        notifications: []
      },
      {
        id: '4',
        username: 'larissa',
        password: '123',
        name: 'Larissa Lurdes',
        email: 'larissa@email.com',
        favouriteSports: [Sports.tennis, Sports.volleyball],
        notifications: []
      },
      {
        id: '5',
        username: 'rebecca',
        password: '123',
        name: 'Rebecca Lunes',
        email: 'rebecca@email.com',
        favouriteSports: [Sports.tennis, Sports.volleyball],
        notifications: []
      },
      {
        id: '6',
        username: 'bruna',
        password: '123',
        name: 'Bruna Mello',
        email: 'bruna@email.com',
        favouriteSports: [Sports.soccer, Sports.baseball],
        notifications: []
      },
      {
        id: '7',
        username: 'larry',
        password: '123',
        name: 'Larry London',
        email: 'larry@email.com',
        favouriteSports: [Sports.soccer, Sports.tennis, Sports.basketball, Sports.volleyball],
        notifications: []
      }
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
    const hour = this.getRandomInt(6, 24);
    const time = hour + ':00';
    let daysInMillisecondsAheadFromNow = this.getRandomInt(1, 15) * 24 * 60 * 60 * 1000;
    let dateFromFuture = new Date(new Date().getTime() + daysInMillisecondsAheadFromNow);
    return DateUtils.getCombinedDateTime(dateFromFuture, time) ?? new Date();
  }

  mockMatchRequestResponse(matchRequest: MatchRequest) {
    //Updating match with new matchRequest
    let matchOfOwner = this.matches.find(match => {
      return match.owner?.username === matchRequest.usernameOwner;
    });
    matchOfOwner?.matchRequests.push(matchRequest);
    //Creating new notification for Owner
    let notifications = this.accounts.find(account => {
      return account.username === matchRequest.usernameOwner;
    })?.notifications;
    notifications?.push(this.factoryService.getNotificationFactory().createMatchRequestNotification());
    //save mockUp data
    this.saveData();
    //response with 200 status
    let response = new HttpResponse<null>;
    return of(response);
  }

  getMockUserNotificationsResponse(userId: string) {
    //create response
    let notificationsResponse: NotificationsResponse = {
      message: 'success',
      userNotifications: []
    }
    //lookup for User and assign value to response
    let account = this.accounts.find(account => account.id === userId);
    if (account) {
      notificationsResponse.userNotifications = account.notifications;
    }
    //
    return of(notificationsResponse);
  }

  mockUpdateUserNotificationsResponse(request: UpdateUserNotificationsRequest) {
    //find user and replace notifications
    let account = this.accounts.find(account => account.id === request.userId);
    if (!account) {
      return of(this.create404ResourceResponse());
    }
    account.notifications = request.notifications;
    //save mockUp data
    this.saveData();
    //return 200 response
    let response = new HttpResponse<null>;
    return of(response);
  }

  private loadData() {
    console.log('loadData from MockService triggered')

    let dataCreated = false;
    const storedAccounts = sessionStorage.getItem(this.accountKeys);
    const storedMatches = sessionStorage.getItem(this.matchesKeys);

    if (storedAccounts) {
      this.accounts = JSON.parse(storedAccounts);
      this.accounts.forEach(account => {
        // Convert the date strings in notifications back to Date objects
        account.notifications = account.notifications.map((n: UserNotification) => {
          n.date = new Date(n.date);
          return n;
        });
      });
    } else {
      this.accounts = this.bootstrapMockAccounts();
      dataCreated = true;
    }

    if (storedMatches) {
      this.matches = JSON.parse(storedMatches);
      this.matches.map((match: any) => {
        // Convert date strings back to Date objects
        match.date = new Date(match.date);
        return match;
      });
      this.matches.forEach(match => {
        match.matchRequests.map(request => {
          return request.date = new Date(request.date)
        })
      });
    } else {
      this.matches = this.bootstrapMockMatches();
      dataCreated = true;
    }
    if (dataCreated) {
      this.saveData();
    }
    // console.log('debug users data: '+JSON.stringify(this.accounts[2]));
  }

  private saveData(): void {
    sessionStorage.setItem(this.accountKeys, JSON.stringify(this.accounts));
    sessionStorage.setItem(this.matchesKeys, JSON.stringify(this.matches));
  }

  mockCreateMatchResponse(request: CreateMatchRequest) {
    let account = this.accounts.find(account => account.id === request.userId);
    if (!account) {
      return of(this.create404ResourceResponse<null>());
    }
    //Create new match in repo
    let newMatch = request.match;
    newMatch.owner = account;
    newMatch.id = uuidv4();
    this.matches.push(newMatch);
    //save mockUp data
    this.saveData();
    //return 200 response
    let response = new HttpResponse<null>;
    return of(response);
  }

  private create404ResourceResponse<T>(resourceName: string = 'resource'): HttpResponse<T> {
    return new HttpResponse<T>({
      status: 404,
      statusText: resourceName+' not Found',
      body: null
    });
  }

  getMockMyMatchResponse(accountId: string) {
    let resourceToFind = 'Account';
    let account = this.accounts.find(account => account.id === accountId);
    if (account) {
      let match = this.matches.find(match => match.owner?.username === account.username);
      resourceToFind = 'Match';
      if (match) {
        let response = new HttpResponse<MyMatchResponse>({
          status: 200,
          statusText: 'OK',
          body: {
            myMatch: match
          }
        });
        return of(response);
      }
    }
    //in case resource not found
    let response = this.create404ResourceResponse<MyMatchResponse>(resourceToFind);
    return of(response);
  }

  getEmptyMyMatchResponse(): MyMatchResponse {
    let emptyMatch: Match = {
      id: '-1',
      name: 'No Match',
      date: new Date(),
      location: 'No Match',
      matchRequests: [],
      sport: 'No Match',
      comments: 'No Match',
      participants: []
    }
    return {
      myMatch: emptyMatch
    };
  }
}

