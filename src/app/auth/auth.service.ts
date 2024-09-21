import {Injectable} from '@angular/core';
import {STORAGE_KEYS} from "../core/keys/storage-keys";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentToken: string | null = null;

  constructor() { }

  storeToken(headers: HttpHeaders): boolean {
    let newToken = headers.get('Authorization');
    if (newToken && newToken.startsWith('Bearer ')) {
      newToken = newToken.slice(7); // Remove "Bearer " (7 characters)
      if (newToken !== this.currentToken) {
        //if it is a new refreshed token from auth backend, store it in localStorage and update the currentToken
        this.currentToken = newToken;
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        return true;
      }
    }
    return false;
  }
  getToken(): string | null {
    if (this.currentToken) {
      return this.currentToken;
    }
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  isConnected(): boolean {
    return this.getToken() !== null;
  }

  getHeaderWithToken() {
    let headers = new HttpHeaders();
    const token = this.getToken(); // Get the token from localStorage or wherever you store it
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  disconnect() {
    this.currentToken = null;
    localStorage.clear();
  }
}
