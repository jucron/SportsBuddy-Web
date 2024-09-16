import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {RoutingService} from "../core/routing/routing.service";
import {AccountService} from "../core/integration/account.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccountService);
  const routerService = inject(RoutingService);
  const isAuthenticated = authService.isAuthenticated();
  const currentRoute = route.url.toString();
  if (currentRoute === 'login' || currentRoute === 'account,create') {
    if (isAuthenticated) {
      console.log('authGuard: user is authenticated, redirecting to home');
      routerService.redirectTo('home', false);
      return false;
    }
  } else {
    if (!isAuthenticated) {
      console.log('authGuard: user is NOT authenticated, redirecting to login');
      routerService.redirectTo('login', false);
      return false;
    }
  }
  return true;
};
