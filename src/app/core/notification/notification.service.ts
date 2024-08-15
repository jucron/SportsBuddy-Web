import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationTimeMls = 15000;

  constructor(private _snackBar: MatSnackBar,) { }

  notificationCreateAccountSuccessfully() {
    const message = 'New account created successfully!';
    this._snackBar.open(message, 'Nice!',{
      duration: this.notificationTimeMls,
      panelClass: ['success-snackbar']
    });
  }
  notificationCreateAccountFailed() {
    const message = 'Some error was found while creating the new account, please try again later';
    this._snackBar.open(message, 'Dang!',{
      duration: this.notificationTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  notificationLoginSuccessfully() {
    const message = 'Welcome! 😁';
    this._snackBar.open(message, 'Great!',{
      duration: this.notificationTimeMls,
      panelClass: ['success-snackbar']
    });
  }
  notificationLoginFailed() {
    const message = 'Login failed.. 😔';
    this._snackBar.open(message, 'Oh no!',{
      duration: this.notificationTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
  notificationGetMatchError() {
    const message = 'Some error was found while getting the Matches List, please try again later';
    this._snackBar.open(message, 'Ai ai ai!',{
      duration: this.notificationTimeMls,
      panelClass: ['fail-snackbar']
    });
  }
}
