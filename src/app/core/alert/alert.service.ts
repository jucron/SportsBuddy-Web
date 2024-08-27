import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertTimeMls = 15000;

  constructor(private _snackBar: MatSnackBar,) { }

  alertCreateAccountSuccess() {
    const message = 'New account created successfully!';
    this._snackBar.open(message, 'Nice!',{
      duration: this.alertTimeMls,
      panelClass: ['success-snackbar']
    });
  }
  alertCreateAccountFailed() {
    const message = 'Some error was found while creating the new account, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  alertLoginSuccess() {
    const message = 'Welcome! 😁';
    this._snackBar.open(message, 'Great!',{
      duration: this.alertTimeMls,
      panelClass: ['success-snackbar']
    });
  }
  alertLoginFailed() {
    const message = 'Login failed.. 😔';
    this._snackBar.open(message, 'Oh no!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  alertGetMatchError() {
    const message = 'Some error was found while getting the Matches List, please try again later';
    this._snackBar.open(message, 'Ai ai ai!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  alertGetAccountFailed() {
    const message = 'Some error was found while getting the existing account, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  alertMatchRequestFailed() {
    const message = 'Some error was found while requesting to participate in this Match, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  alertMatchRequestSuccess() {
    const message = 'The request has been sent to the Owner of this Match! 🚀';
    this._snackBar.open(message, 'Oh yeah!',{
      duration: this.alertTimeMls,
      panelClass: ['success-snackbar']
    });
  }

  alertGetUserNotificationsError() {
    const message = 'Some error was found while FETCHING the User Notifications, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  alertUpdateNotificationsError() {
    const message = 'Some error was found while UPDATING the User Notifications, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.alertTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
}
