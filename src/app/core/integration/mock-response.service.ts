import {Injectable, OnInit} from '@angular/core';
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
import {MyMatchResponse} from "../model/responses/myMatchResponse";
import {GenericResponse} from "../model/responses/genericResponse";
import {LoginRequest} from "../model/requests/loginRequest";
import {accountRequest} from "../model/requests/accountRequest";
import {MatchRequestDecision} from "../model/requests/matchRequestDecision";
import {MessageType} from "../model/messageType";
import {MessageStatus} from "../model/messageStatus";
import {ChatDataType} from "../model/chatDataType";
import {ChatData} from "../model/chatData";
import {SESSION_KEYS} from "../keys/session-keys";
import {SendMatchRoomMessageRequest} from "../model/requests/sendMatchRoomMessageRequest";
import {ChatMessage} from "../model/chatMessage";
import {SendMatchRoomMessageResponse} from "../model/responses/sendMatchRoomMessageResponse";

@Injectable({
  providedIn: 'root'
})
export class MockResponseService implements OnInit{
  accounts: Account[] = [];
  matches: Match[] = [];
  accountKeys = SESSION_KEYS.ACCOUNT_KEY;
  matchesKeys = SESSION_KEYS.MATCHES_KEY;
  JWTKeys = 'jwt-keys'

  constructor(private factoryService: FactoryService) {
    this.loadData();
  }
  ngOnInit(): void {
    this.loadData();
  }
  private bootstrapMockMatches(): Match[] {
    return [
      {
        id: uuidv4(),
        name: '3 on 3',
        date: this.getRandomDate(),
        location: 'Plaza sports center',
        comments: 'Bring all friends!',
        sport: Sports.basketball,
        owner: this.accounts[1],
        participants: [this.accounts[2], this.accounts[4]],
        matchRequests: [],
        chatData: this.generateMockMatchChatMessages()
      },
      {
        id: uuidv4(),
        name: 'Soccer relax',
        date: this.getRandomDate(),
        location: 'Main field',
        comments: 'I have the ball already, so just come =)',
        sport: Sports.soccer,
        owner: this.accounts[2],
        participants: [this.accounts[4], this.accounts[5]],
        matchRequests: [],
        chatData: null
      },
      {
        id: uuidv4(),
        name: 'Tennis with friends',
        date: this.getRandomDate(),
        location: 'Tennis club',
        comments: 'Everyone is welcome!',
        sport: Sports.tennis,
        owner: this.accounts[3],
        participants: [this.accounts[5], this.accounts[6]],
        matchRequests: [],
        chatData: null
      },
      {
        id: uuidv4(),
        name: 'Beach Volleyball!',
        date: this.getRandomDate(),
        location: 'Long beach',
        comments: 'Were starting when we have 4',
        sport: Sports.volleyball,
        owner: this.accounts[5],
        participants: [this.accounts[1], this.accounts[2], this.accounts[4]],
        matchRequests: [],
        chatData: null
      }
    ];
  }
  private generateMockMatchRequests() {
    let matchRequest: MatchRequest = {
      userIdRequested: this.accounts[3].id,
      userNameRequested: this.accounts[3].name,
      date: new Date(),
      userIdOwner: this.accounts[1].id,
      comment: 'I want to play too!'
    };
    this.mockMatchRequestResponse(matchRequest);
    matchRequest = {
      userIdRequested: this.accounts[5].id,
      userNameRequested: this.accounts[5].name,
      date: new Date(),
      userIdOwner: this.accounts[1].id,
      comment: 'Let\'s do this!'
    };
    this.mockMatchRequestResponse(matchRequest);
  }
  private generateMockMatchChatMessages(): ChatData {
    return {
      chatMessages: [
        {
          id: uuidv4(),
          sender: this.accounts[1],
          text: 'Hey guys, I have the ball!',
          timestamp: new Date(),
          status: MessageStatus.SENT,
          type: MessageType.TEXT
        },
        {
          id: uuidv4(),
          sender: this.accounts[2],
          text: 'I am on my way!',
          timestamp: new Date(),
          status: MessageStatus.SENT,
          type: MessageType.TEXT
        },
        {
          id: uuidv4(),
          sender: this.accounts[4],
          text: 'I will be there in 10 minutes',
          timestamp: new Date(),
          status: MessageStatus.SENT,
          type: MessageType.TEXT
        }
      ],
      chatDataType: ChatDataType.MATCH
    }
  }
  private bootstrapMockAccounts(): Account[] {
    return [
      {
        id: uuidv4(),
        username: 'admin',
        password: 'admin',
        name: 'admin',
        email: 'admin@email.com',
        favouriteSports: [],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      },
      {
        id: uuidv4(),
        username: 'john',
        password: '123',
        name: 'John Masters',
        email: 'john@email.com',
        favouriteSports: [Sports.baseball, Sports.soccer],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      },
      {
        id: uuidv4(),
        username: 'larissa',
        password: '123',
        name: 'Larissa Lurdes',
        email: 'larissa@email.com',
        favouriteSports: [Sports.basketball, Sports.soccer],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      },
      {
        id: uuidv4(),
        username: 'frank',
        password: '123',
        name: 'Frank Furt',
        email: 'frankie@email.com',
        favouriteSports: [Sports.tableTennis, Sports.soccer],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      },
      {
        id: uuidv4(),
        username: 'rebecca',
        password: '123',
        name: 'Rebecca Lunes',
        email: 'rebecca@email.com',
        favouriteSports: [Sports.tennis, Sports.volleyball],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      },
      {
        id: uuidv4(),
        username: 'bruna',
        password: '123',
        name: 'Bruna Mello',
        email: 'bruna@email.com',
        favouriteSports: [Sports.soccer, Sports.baseball],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      },
      {
        id: uuidv4(),
        username: 'larry',
        password: '123',
        name: 'Larry London',
        email: 'larry@email.com',
        favouriteSports: [Sports.soccer, Sports.tennis, Sports.basketball, Sports.volleyball],
        notifications: [],
        myMatch: null,
        participatingMatches: []
      }
    ];
  }
  getLoginMockResponse(loginRequest: LoginRequest): LoginResponse {
    let mockResponse: LoginResponse = {
      userId: '',
      myMatchId: null,
      message: 'login-failed'
    };
    let userId = this.validateLoginAndReturnId(loginRequest.credentials!.username, loginRequest.credentials!.password);
    if (userId) {
      let myMatch = this.matches.find(match => match.owner?.username === loginRequest.credentials!.username);
      mockResponse.userId = userId;
      mockResponse.myMatchId = myMatch?.id ?? null;
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
  getCreateAccountMockResponse(createAccountRequest: accountRequest): GenericResponse {
    //check if username is taken
    let usernameTaken = this.accounts.some(account => createAccountRequest.account.username === account.username);
    if (usernameTaken) {
      return {message: 'username-taken'};
    }
    //if username available, create new account
    let newAccount = createAccountRequest.account;
    newAccount.id = uuidv4();
    newAccount.notifications = [];
    newAccount.myMatch = null;
    newAccount.participatingMatches = [];
    this.accounts.push(createAccountRequest.account);
    //save mockUp data
    this.saveData();
    //response
    return {
      message: 'account-created'};
  }
  getMockMatchesResponse(): MatchResponse {
    //backend note: the username will be taken from the JWT token
    return {
      message: 'getMatch-success',
      matches: this.matches,
    };
  }
  getAccountMockResponse(accountId: string): AccountResponse {
    let account = this.accounts.find(account => account.id === accountId);
    if (!account) {
      return {
        message: 'account-not-found',
        account: null
      };
    }
    account.participatingMatches = this.matches.filter(match => match.participants.some(participant => participant.username === account.username));
    account.myMatch = this.matches.find(match => match.owner?.username === account.username) ?? null;
    //removing bidirectional references
    // if (account.myMatch) { account.myMatch.owner = null;}
    // account.participatingMatches.forEach(match => {match.participants = [];});
    //return response
    return {
      message: 'account-found',
      account: account
    };
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
      return match.owner?.id === matchRequest.userIdOwner;
    });
    //Filling the userNameRequested
    matchRequest.userNameRequested = this.accounts.find(account => {
      return account.id === matchRequest.userIdRequested;
    })?.name ?? 'not-found';
    //Adding new matchRequest to match
    matchOfOwner!.matchRequests.push(matchRequest);
    //Creating new notification for Owner
    let notifications = this.accounts.find(account => {
      return account.id === matchRequest.userIdOwner;
    })?.notifications;
    notifications?.push(this.factoryService.getNotificationFactory().createMatchRequestNotification(matchOfOwner!.id));
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
      console.log('data found in Session, loading data');
      this.accounts = JSON.parse(storedAccounts);
      this.accounts.forEach(account => {
        // Convert the date strings in notifications back to Date objects
        account.notifications = account.notifications.map((n: UserNotification) => {
          n.date = new Date(n.date);
          return n;
        });
      });
    } else {
      console.log('no data in Session found, creating mock data');
      this.accounts = this.bootstrapMockAccounts();
      dataCreated = true;
    }

    if (storedMatches) {
      this.matches = JSON.parse(storedMatches);
      //Convert date strings back to Date objects:
      this.matches.forEach(match => {
        //a) convert match date
        match.date = new Date(match.date);
        //b) convert matchRequests date
        match.matchRequests.map(request => {
          return request.date = new Date(request.date)
        });
        //c) convert chatMessages date
        match.chatData?.chatMessages.map(message => {
          return message.timestamp = new Date(message.timestamp);
        });
      });
    } else {
      this.matches = this.bootstrapMockMatches();
      this.generateMockMatchRequests();
      dataCreated = true;
    }
    if (dataCreated) {
      this.saveData();
    }
    // console.log('debug users data: '+JSON.stringify(this.accounts[2]));
  }
  private saveData(): void {
    try {
      sessionStorage.setItem(this.accountKeys, JSON.stringify(this.accounts));
      sessionStorage.setItem(this.matchesKeys, JSON.stringify(this.matches));
    } catch (error) {
      console.error('Error saving data to sessionStorage:', error);
    }
  }
  mockCreateMatchResponse(request: CreateMatchRequest) {
    let response: GenericResponse = {
      message: 'create match failed'
    }
    let account = this.accounts.find(account => account.id === request.userId);
    if (!account) {
      return response;
    }
    //Create new match in repo
    let newMatch = request.match;
    newMatch.owner = account;
    newMatch.id = uuidv4();
    newMatch.participants = []
    newMatch.matchRequests = []
    this.matches.push(newMatch);
    //save mockUp data
    this.saveData();
    //return ok response
    response.message = newMatch.id;
    return response;
  }
  getMockMatchResponse(matchId: string) {
    let response: MyMatchResponse = {
      myMatch: null,
      message: 'not found'
    }
    let match = this.matches.find(match => match.id === matchId);
    if (match) {
      response.message = 'match-found';
      response.myMatch = match;
      return response;
    }
    //in case resource not found
    return response;
  }

  getCurrentMockJWT() {
    const storedJWT = sessionStorage.getItem(this.JWTKeys);
    if (storedJWT) {
      return storedJWT;
    }
    const newJWT = this.generateNewJWT();
    sessionStorage.setItem(this.JWTKeys, newJWT);
    return newJWT;
  }

  private generateNewJWT() {
    return 'Bearer ' + uuidv4();
  }

  getUpdateAccountMockResponse(accountRequest: accountRequest) {
    //check if username is taken
    let existingMatch = this.accounts.find(account => accountRequest.account.id === account.id);
    if (!existingMatch) {
      return {message: 'match-not-found'};
    }
    //path updated data to existing match
    existingMatch.name = accountRequest.account.name;
    existingMatch.email = accountRequest.account.email;
    existingMatch.favouriteSports = accountRequest.account.favouriteSports;
    //save mockUp data
    this.saveData();
    //response
    return {
      message: 'account-updated'
    };
  }

  mockMatchRequestDecisionResponse(requestDecision: MatchRequestDecision) {
    let response: GenericResponse = {
      message: 'match-request-decision-processed'
    }
    //find match of owner
    let matchOfOwner = this.matches.find(match => match.owner?.id === requestDecision.matchRequest.userIdOwner);
    if (!matchOfOwner) {
      return {message: 'match-not-found'};
    }
    //add participant to match, if accepted
    if (requestDecision.accept) {
      let participant = this.accounts.find(account => account.id === requestDecision.matchRequest.userIdRequested);
      if (!participant) {
        return {message: 'participant-not-found'};
      }
      matchOfOwner.participants.push(participant);
      //add notification to participant
      participant.notifications.push(this.factoryService.getNotificationFactory().createMatchRequestAcceptedNotification(matchOfOwner.id));
    }
    //remove matchRequest from match
    matchOfOwner.matchRequests = matchOfOwner.matchRequests.filter(request => request.userIdRequested !== requestDecision.matchRequest.userIdRequested);
    //save mockUp data
    this.saveData();
    //return response
    return response;
  }


  getMockSendMatchRoomMessageResponse(request: SendMatchRoomMessageRequest): SendMatchRoomMessageResponse {
    //find match
    let existingMatch = this.matches.find(match => match.id === request.matchId);
    if (!existingMatch) {
      return {message: 'match-not-found', chatData: null};
    }
    //find sender
    let sender = this.accounts.find(account => account.id === request.senderId);
    if (!sender) {
      return {message: 'sender-not-found', chatData: null};
    }
    //breaking circular reference in Account's object
    sender.participatingMatches = [];
    //create new chatMessage with sender and timestamp
    let newMessage: ChatMessage = request.message;
    newMessage.id = uuidv4();
    newMessage.sender = sender;
    newMessage.timestamp = new Date();
    //check if chatData and chatMessages exists, if not create it
    // console.log('chatData: ' + JSON.stringify(existingMatch.chatData));
    console.log(`!existingMatch.chatData: ${!existingMatch.chatData} - !existingMatch.chatData.chatMessages: ${!existingMatch.chatData?.chatMessages}`)
    if (!existingMatch.chatData) {
      existingMatch.chatData = {
        chatDataType: ChatDataType.MATCH,
        chatMessages: []
      };
    }
    if (!existingMatch.chatData.chatMessages) {
      existingMatch.chatData.chatMessages = [];
    }
    //add message to match chatData
    existingMatch.chatData.chatMessages.push(newMessage);
    console.log('message sent')
    //save mockUp data
    this.saveData()
    //return response
    return {
      message: 'message-sent',
      chatData: existingMatch.chatData
    };
  }
}

