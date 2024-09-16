import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {RoutingService} from "../core/routing/routing.service";
import {AccountService} from "../core/integration/account.service";
import {STORAGE_KEYS} from "../core/keys/storage-keys";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccountService);
  const routerService = inject(RoutingService);
  const isAuthenticated = authService.isAuthenticated();
  const currentRoute = state.url;
  const id = route.paramMap.get('id');
  if (currentRoute === '/login' || currentRoute === '/account/create') {
    if (isAuthenticated) {
      console.log('authGuard: user is authenticated, redirecting to home');
      routerService.redirectTo('home', false);
      return false;
    }
  } else if (!isAuthenticated) {
    console.log('authGuard: user is NOT authenticated, redirecting to login');
    routerService.redirectTo('login', false);
    return false;

  } else if (id && currentRoute === `/match-room/${id}/owner`) {
    const myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
    if (myMatchId) {
      if (myMatchId !== id) {
        console.log('authGuard: user is NOT the owner of the match, redirecting to home');
        routerService.redirectTo('home', false);
        return false;
      }
    }
  } else if (id && currentRoute === `/match-room/${id}/participant`) {
    const myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
    if (myMatchId) {
      if (myMatchId === id) {
        console.log('authGuard: user IS the owner of the match, redirecting to my match as owner');
        routerService.redirectTo(`/match-room/${id}/owner`, false);
        return false;
      }
    }
  }
  //
  return true;
};
