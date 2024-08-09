import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {Observable, of} from "rxjs";
import {Match} from "../model/match";

@Injectable({
  providedIn: 'root'
})
export class MockResponseService {

  constructor() { }

  getLoginMockResponse(): Observable<Response> {
    const mockResponse: Response = { message: 'mockToken' };
    return of(mockResponse);
  }
  getMockMatches(): Match[] {
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

}
