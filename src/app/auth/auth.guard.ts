import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {RoutingService} from "../core/routing/routing.service";
import {AccountService} from "../core/integration/account.service";
import {STORAGE_KEYS} from "../core/keys/storage-keys";
import {map} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccountService);
  const routerService = inject(RoutingService);
  const accountService = inject(AccountService);
  const isAuthenticated = authService.isAuthenticated();
  const currentRoute = state.url;
  const id = route.paramMap.get('id');

  //1st: Handling open routes when user is authenticated
  if (currentRoute === '/login' || currentRoute === '/account/create') {
    if (isAuthenticated) {
      console.log('authGuard: user is authenticated, redirecting to home');
      routerService.redirectTo('home', false);
      return false;
    }

    //2nd: Handling protected routes when user is not authenticated
  } else if (!isAuthenticated) {
    console.log('authGuard: user is NOT authenticated, redirecting to login');
    routerService.redirectTo('login', false);
    return false;

    //3rd: Handling match creation route when user already have a match
  } else if (currentRoute === '/match') {
    const myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
    if (myMatchId) {
      console.log('authGuard: user have a Match already, redirecting to match-room');
      routerService.redirectTo(`/match-room/${myMatchId}/owner`, false);
    }
    return false;

    //4th: Handling match-room-owner routes when user is not the owner
  } else if (id && currentRoute === `/match-room/${id}/owner`) {
    const myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
    if (myMatchId) {
      if (myMatchId !== id) {
        console.log('authGuard: user is NOT the owner of the match, redirecting to home');
        routerService.redirectTo('home', false);
        return false;
      }
    }

    //5th: Handling match-room-participant routes ..
  } else if (id && currentRoute === `/match-room/${id}/participant`) {
    //5.1: user is the owner
    const myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
    if (myMatchId) {
      if (myMatchId === id) {
        console.log('authGuard: user IS the owner of the match, redirecting to my match as owner');
        routerService.redirectTo(`/match-room/${id}/owner`, false);
        return false;
      }
    }
    //5.2: user is not participating
    const myUserId = authService.getLoggedAccountId();
    if (myUserId) {
      return accountService.getAccount(myUserId)
        .pipe(
          map(account => {
          let isParticipant = account?.participatingMatches?.some(match => match.id === id);
          if (!isParticipant) {
            console.log('authGuard: user is NOT a participant of the match, redirecting to home');
            routerService.redirectTo('home', false);
            return false;
          }
          return true;
        }));
    }
  }
  //
  return true;
};
