import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {AccountService} from "../core/integration/account.service";
import {RoutingService} from "../core/routing/routing.service";

export const loggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccountService);
  const routerService = inject(RoutingService);
  const isAuthenticated = authService.isAuthenticated();
  if (isAuthenticated) {
    console.log('loggedGuard: user is authenticated, redirecting to home');
    routerService.redirectTo('home', false);
    return false;
  }
  return true;
};
