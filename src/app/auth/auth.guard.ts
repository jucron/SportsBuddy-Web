import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {RoutingService} from "../core/routing/routing.service";
import {AccountService} from "../core/integration/account.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccountService);
  const routerService = inject(RoutingService);
  const isAuthenticated = authService.isAuthenticated();
  if (!isAuthenticated) {
    routerService.redirectTo('login', false);
  }
  return isAuthenticated;
};
