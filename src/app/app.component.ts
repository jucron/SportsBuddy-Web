import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {LoginService} from "./core/integration/login.service";
import {STORAGE_KEYS} from "./core/keys/storage-keys";
import {RoutingService} from "./core/routing/routing.service";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, RouterModule, MatSidenavModule, MatButton, FlexModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SportsBuddy-Web';
  showFiller = false;

  constructor(private loginService: LoginService,
              private routingService: RoutingService) {
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
}
