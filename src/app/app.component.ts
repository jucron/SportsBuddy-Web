import {Component, OnInit} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {AccountService} from "./core/integration/account.service";
import {STORAGE_KEYS} from "./core/keys/storage-keys";
import {RoutingService} from "./core/routing/routing.service";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatBadgeModule} from "@angular/material/badge";
import {NotificationStatus, UserNotification} from "./core/model/userNotification";
import {NotificationService} from "./core/integration/notification.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NotificationHelper} from "./core/helper-components/notificationHelper";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatProgressSpinnerModule, RouterOutlet, MatSlideToggleModule, RouterModule, MatSidenavModule, MatButton, FlexModule, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'SportsBuddy-Web';
  showFiller = false;
  userNotifications: UserNotification[] = [];
  protected isLoadingNotifications: boolean = false;
  protected notificationHelper: NotificationHelper

  constructor(private loginService: AccountService,
              private routingService: RoutingService,
              private notificationService: NotificationService) {
    this.notificationService.userNotifications$.subscribe(notifications => {
      this.userNotifications = notifications;
    });
    this.notificationHelper = new NotificationHelper();
  }

  ngOnInit(): void {
    this.notificationService.loadUserNotifications();
  }

  isLogged(): boolean {
    return localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME) != null;
  }

  logout() {
    this.loginService.executeLogout();
    this.changeFiller();
  }

  changeFiller() {
    this.showFiller = !this.showFiller;
  }

  getCurrentUsername() {
    return localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME);
  }

  routeToUpdateMyAccount() {
    const id = localStorage.getItem(STORAGE_KEYS.MAIN_ID);
    if (id) {
      this.routingService.navigateWithParam('account/update/',false,id);
    }
  }

  actOnNotification(notification: UserNotification) {
    notification.status = NotificationStatus.ACTIONED;
    let userNotification = this.userNotifications.find(not => not.id === notification.id);
    if (userNotification) {
      userNotification.status = NotificationStatus.ACTIONED;
    }
    this.notificationService.updateUserNotifications(this.userNotifications);
    this.routingService.redirectTo(notification.link,false);
  }

  readNotifications() {
    this.userNotifications.forEach(notification => {
      notification.status = NotificationStatus.READ;
    })
    this.notificationService.updateUserNotifications(this.userNotifications);
  }

}
