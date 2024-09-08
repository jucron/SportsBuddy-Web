import {Injectable} from '@angular/core';
import {LoginResponse} from "../model/responses/loginResponse";
import {Match} from "../model/match";
import {Account} from "../model/account";
import {MatchResponse} from "../model/responses/matchResponse";
import {AccountResponse} from "../model/responses/accountResponse";
import {DateUtils} from "../utils/dateUtils";
import {Sports} from "../model/sports";
import {MatchRequest} from "../model/requests/matchRequest";
import {NotificationsResponse} from "../model/responses/notificationsResponse";
import {UpdateUserNotificationsRequest} from "../model/requests/updateUserNotificationsRequest";
import {FactoryService} from "../factory/factory.service";
import {UserNotification} from "../model/userNotification";
import {CreateMatchRequest} from "../model/requests/createMatchRequest";
import {v4 as uuidv4} from 'uuid';
import {STORAGE_KEYS} from "../keys/storage-keys";
import {MyMatchResponse} from "../model/responses/myMatchResponse";
import {GenericResponse} from "../model/responses/genericResponse";
import {LoginRequest} from "../model/requests/loginRequest";
import {CreateAccountRequest} from "../model/requests/createAccountRequest";

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

  getLoginMockResponse(loginRequest: LoginRequest): LoginResponse {
    let mockResponse: LoginResponse = {
      id: '',
      message: 'login-failed'
    };
    let id = this.validateLoginAndReturnId(loginRequest.credentials!.username, loginRequest.credentials!.password);
    if (id) {
      mockResponse.id = id;
      mockResponse.message = 'login-success';
    }
    return mockResponse;
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
  getCreateAccountMockResponse(createAccountRequest: CreateAccountRequest): GenericResponse {
    //check if username is taken
    let usernameTaken = this.accounts.some(account => createAccountRequest.account!.username === account.username);
    if (usernameTaken) {
      return {message: 'username-taken'};
    }
    //if username available, create new account
    this.accountMockId++;
    createAccountRequest.account!.id = (this.accountMockId).toString();
    this.accounts.push(createAccountRequest.account!);
    //save mockUp data
    this.saveData();
    //response
    return {
      message: 'account-created'};
  }
  getMockMatchesResponse(): MatchResponse {
    //backend note: the username will be taken from the JWT token
    const hasMatch = this.matches.some(match => match.owner?.username == localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME));
    return {
      message: 'getMatch-success',
      matches: this.matches,
      hasMatch: hasMatch
    };
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
    let response: GenericResponse = {
      message: 'match-request-sent'
    };
    return response;
  }
  getMockUserNotificationsResponse(userId: string) {
    //create response
    let notificationsResponse: NotificationsResponse = {
      message: 'notifications-not-found',
      userNotifications: []
    }
    //lookup for User and assign value to response
    let account = this.accounts.find(account => account.id === userId);
    if (account) {
      notificationsResponse.userNotifications = account.notifications;
      notificationsResponse.message = 'notifications-found';
    }
    //
    return notificationsResponse;
  }
  mockUpdateUserNotificationsResponse(request: UpdateUserNotificationsRequest) {
    let response: GenericResponse = {
      message: 'not-found'
    }
    //find user and replace notifications
    let account = this.accounts.find(account => account.id === request.userId);
    if (!account) {
      return response;
    }
    //if found, update user notifications
    account.notifications = request.notifications;
    //save mockUp data
    this.saveData();
    //return ok response
    response.message = 'notifications-updated';
    return response;
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
    let response: GenericResponse = {
      message: 'not found'
    }
    let account = this.accounts.find(account => account.id === request.userId);
    if (!account) {
      return response;
    }
    //Create new match in repo
    let newMatch = request.match;
    newMatch.owner = account;
    newMatch.id = uuidv4();
    this.matches.push(newMatch);
    //save mockUp data
    this.saveData();
    //return ok response
    response.message = 'match-created';
    return response;
  }
  getMockMyMatchResponse(accountId: string) {
    let response: MyMatchResponse = {
      myMatch: null,
      message: 'not found'
    }
    let resourceToFind = 'Account';
    let account = this.accounts.find(account => account.id === accountId);
    if (account) {
      let match = this.matches.find(match => match.owner?.username === account.username);
      resourceToFind = 'Match';
      if (match) {
        response.message = 'match-found';
        response.myMatch = match;
        return response;
      }
    }
    //in case resource not found
    return response;
  }

}

