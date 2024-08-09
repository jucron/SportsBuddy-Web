import { Injectable } from '@angular/core';
import {Response} from "../model/response";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MockResponseService {

  constructor() { }

  getLoginMockResponse(): Observable<Response> {
    const mockResponse: Response = { message: 'mockToken' };
    return of(mockResponse);
  }
}
