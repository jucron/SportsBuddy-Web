import {Injectable} from '@angular/core';
import {catchError, delay, finalize, map, of} from "rxjs";
import {ApiService} from "./api.service";
import {AlertService} from "../alert/alert.service";
import {UserNotification} from "../model/userNotification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  isLoading = false;

  constructor(private apiService: ApiService,
              private alertService: AlertService) { }

  getUserNotifications() {
    this.isLoading = true;
    return this.apiService.getUserNotifications().pipe(
      delay(1000),
      map(notificationsResponse => {
        if (notificationsResponse != null && notificationsResponse.message !== 'getUserNotifications-failed') {
          return  notificationsResponse.userNotifications;
        } else {
          this.alertService.alertGetUserNotificationsError();
          return [];
        }
      }),
      catchError(err => {
        console.error('getUserNotifications failed', err);
        this.alertService.alertGetUserNotificationsError();
        return of([]); // Return an empty array in case of error
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  updateUserNotifications(userNotifications: UserNotification[]) {
    //todo
  }
}
