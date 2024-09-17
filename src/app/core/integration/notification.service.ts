import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, map, Observable, of} from "rxjs";
import {ApiService} from "./api.service";
import {AlertService} from "../alert/alert.service";
import {NotificationStatus, UserNotification} from "../model/userNotification";
import {RoutingService} from "../routing/routing.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  isLoading = false;
  private userNotificationsSubject: BehaviorSubject<UserNotification[]> = new BehaviorSubject<UserNotification[]>([]);
  userNotifications$: Observable<UserNotification[]> = this.userNotificationsSubject.asObservable();


  constructor(private apiService: ApiService,
              private alertService: AlertService,
              private routingService: RoutingService) { }

  loadUserNotifications() {
    this.isLoading = true;
    return this.apiService.getUserNotifications().pipe(
      map(notifications => {
        if (notifications) {
          return notifications;
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
      .subscribe({
        next: (response) => {
          if (!response) {
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
  readNotifications() {
    let userNotifications = this.userNotificationsSubject.getValue();
    const hasUnreadNotifications = userNotifications.some(notification => notification.status === NotificationStatus.UNREAD);
    //
    if (hasUnreadNotifications) {
      userNotifications.forEach(notification => {
        notification.status = NotificationStatus.READ;
      })
      this.updateUserNotifications(userNotifications);
    }
  }
  actOnNotification(notification: UserNotification) {
    let userNotifications = this.userNotificationsSubject.getValue();
    notification.status = NotificationStatus.ACTIONED;
    let userNotification = userNotifications.find(not => not.id === notification.id);
    if (userNotification) {
      userNotification.status = NotificationStatus.ACTIONED;
    }
    this.updateUserNotifications(userNotifications);
    this.routingService.redirectTo(notification.link,false);
  }
}
