import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ALERT_CACHE_KEYS} from "../keys/alert-cache-keys";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertTimeMls = 15000;

  constructor(private _snackBar: MatSnackBar,) { }

  alertCreateAccountSuccess() {
    const message = 'New account created successfully!';
    this.generateSuccessSnackBar(message);
  }
  alertCreateAccountFailed() {
    const message = 'Some error was found while creating the new account, please try again later';
    this.generateFailSnackBar(message);
  }
  alertLoginSuccess() {
    const message = 'Welcome! 😁';
    this.generateSuccessSnackBar(message);
  }
  alertLoginFailed() {
    const message = 'Login failed.. 😔';
    this.generateFailSnackBar(message);
  }
  alertGetMatchesError() {
    const message = 'Some error was found while getting the Matches List, please try again later';
    this.generateFailSnackBar(message);
  }
  alertGetAccountFailed() {
    const message = 'Some error was found while getting the existing account, please try again later';
    this.generateFailSnackBar(message);
  }
  alertMatchRequestFailed() {
    const message = 'Some error was found while requesting to participate in this Match, please try again later';
    this.generateFailSnackBar(message);
  }
  alertMatchRequestSuccess() {
    const message = 'The request has been sent to the Owner of this Match! 🚀';
    this.generateSuccessSnackBar(message);
  }

  alertGetUserNotificationsError() {
    const message = 'Some error was found while FETCHING the User Notifications, please try again later';
    this.generateFailSnackBar(message);
  }
  alertUpdateNotificationsError() {
    const message = 'Some error was found while UPDATING the User Notifications, please try again later';
    this.generateFailSnackBar(message);
  }

  alertCreateMatchFailed() {
    const message = 'Some error was found while CREATING a new Match, please try again later';
    this.generateFailSnackBar(message);
  }
  alertGetMatchError() {
    const message = 'Some error was found while fetching the desired Match, please try again later';
    this.generateFailSnackBar(message);
  }

  alertUpdateAccountFailed() {
    const message = 'Some error was found while updating your Account, please try again later';
    this.generateFailSnackBar(message);
  }

  alertUpdateAccountSuccess() {
    const message = 'Your account was update successfully! 🚀';
    this.generateSuccessSnackBar(message);
  }

  alertCreateMatchSuccess() {
    const message = 'Your match was created successfully! 🚀';
    this.generateSuccessSnackBar(message);
  }

  alertMatchRequestDecisionSuccess() {
    const message = 'Your match request decision was sent!! 🚀';
    this.generateSuccessSnackBar(message);
  }

  alertMatchRequestDecisionFailed() {
    const message = 'Some error was found while sending the match request decision, please try again later';
    this.generateFailSnackBar(message);
  }

  alertMatchRoomMessageSuccess() {
    const message = 'Your message was sent successfully! 🚀';
    this.generateSuccessSnackBar(message);
  }

  alertMatchRoomMessageFailed() {
    const message = 'Some error was found while sending the message, please try again later';
    this.generateFailSnackBar(message);
  }

  private generateSuccessSnackBar(message: string) {
    this.generateSnackBar(message, this.getSuccessActionMessage(),'success-snackbar');
  }

  private generateFailSnackBar(message: string) {
    this.generateSnackBar(message, this.getFailActionMessage(),'fail-snackbar');
  }
  private generateSnackBar(message: string,actionMessage: string, panelClass: string) {
    this._snackBar.open(message, actionMessage,{
      duration: this.alertTimeMls,
      panelClass: [panelClass]
    });
  }

  private getSuccessActionMessage() {
    //return randomly 5 different messages
    const messages = [
      'Great!',
      'Nice one!',
      'Yay!',
      'Oh yeah!',
      'Good to hear!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getFailActionMessage() {
    //return randomly 5 different messages
    const messages = [
      'Dang!',
      'Oh no!',
      'Ai ai ai!',
      'Hell no!',
      'Stop testing me! >_<'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  cacheAlert(alertKey: string) {
    sessionStorage.setItem(ALERT_CACHE_KEYS.STORE_KEY,alertKey)
  }

  releaseCachedAlert() {
    const storedAlertKey = sessionStorage.getItem(ALERT_CACHE_KEYS.STORE_KEY);
    if (storedAlertKey) {
      switch (storedAlertKey) {
        case ALERT_CACHE_KEYS.MATCH_ROOM_MESSAGE_SUCCESS:
          this.alertMatchRoomMessageSuccess();
          break;
        case ALERT_CACHE_KEYS.MATCH_REQUEST_DECISION_SUCCESS:
          this.alertMatchRequestDecisionSuccess();
          break;
        default:
          console.warn('Cached alert not found in expected values');
          break;
      }
      sessionStorage.removeItem(ALERT_CACHE_KEYS.STORE_KEY)
    }
  }
}
