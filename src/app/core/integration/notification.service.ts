import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, delay, finalize, map, Observable, of} from "rxjs";
import {ApiService} from "./api.service";
import {AlertService} from "../alert/alert.service";
import {UserNotification} from "../model/userNotification";
import {HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  isLoading = false;
  private userNotificationsSubject: BehaviorSubject<UserNotification[]> = new BehaviorSubject<UserNotification[]>([]);
  userNotifications$: Observable<UserNotification[]> = this.userNotificationsSubject.asObservable();


  constructor(private apiService: ApiService,
              private alertService: AlertService) { }

    loadUserNotifications() {
    this.isLoading = true;
    return this.apiService.getUserNotifications().pipe(
      delay(1000),
      map(notificationsResponse => {
        if (notificationsResponse != null && notificationsResponse.message !== 'getUserNotifications-failed') {
          return notificationsResponse.userNotifications;
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
    ).subscribe(notifications => {
      this.userNotificationsSubject.next(notifications);
    });
  }

  updateUserNotifications(userNotifications: UserNotification[]) {
    this.isLoading = true;
    this.apiService.updateUserNotifications(userNotifications)
      .pipe(delay(1000))
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response != null && response.status === 200) {
          } else {
            this.alertService.alertUpdateNotificationsError();
          }
        },
        error: err => {
          console.error('updateUserNotifications failed', err);
          this.alertService.alertUpdateNotificationsError();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
