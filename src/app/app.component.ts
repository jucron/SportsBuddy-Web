import {Component, OnInit} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {AccountService} from "./core/integration/account.service";
import {RoutingService} from "./core/routing/routing.service";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatBadgeModule} from "@angular/material/badge";
import {UserNotification} from "./core/model/userNotification";
import {NotificationService} from "./core/integration/notification.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NotificationHelper} from "./core/helper-components/notificationHelper";
import {AuthService} from "./core/integration/auth.service";

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

  constructor(private accountService: AccountService,
              private routingService: RoutingService,
              private notificationService: NotificationService,
              private authService: AuthService) {
    this.notificationService.userNotifications$.subscribe(notifications => {
      this.userNotifications = notifications;
    });
    this.notificationHelper = new NotificationHelper();
  }

  ngOnInit(): void {
    if (this.isLogged()) {
      this.notificationService.loadUserNotifications();
    }
  }
  isLogged(): boolean {
    return this.accountService.isAuthenticated() && this.authService.isConnected();
  }
  logout() {
    this.accountService.executeLogout();
    this.changeFiller();
  }
  changeFiller() {
    this.showFiller = !this.showFiller;
  }
  getCurrentUsername() {
    return this.accountService.getLoggedUsername();
  }
  routeToUpdateMyAccount() {
    const id = this.accountService.getLoggedAccountId();
    if (id) {
      this.routingService.navigateWithParam('account/update/',false,id);
    }
  }
  actOnNotification(notification: UserNotification) {
    this.notificationService.actOnNotification(notification);
  }

  readNotifications() {
    this.notificationService.readNotifications();
  }

  routeToHome() {
    this.routingService.redirectTo('home',false);
  }
}
