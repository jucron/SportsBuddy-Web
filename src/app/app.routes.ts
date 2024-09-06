import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AccountComponent} from "./account/account.component";
import {MatchComponent} from "./match/match.component";
import {ACCOUNT_STATE_KEYS} from "./core/keys/account-state-keys";
import {MATCH_ROOM_STATE_KEYS} from "./core/keys/match-room-keys";
import {MatchRoomComponent} from "./match-room/match-room.component";
import {authGuard} from "./auth/auth.guard";
import {PageNotFoundComponent} from "./core/helper-components/page-not-found/page-not-found/page-not-found.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate: [authGuard]},
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},
  { path: 'account/create', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.CREATE_STATE }, canActivate: [authGuard] },
  { path: 'account/update/:id', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.UPDATE_STATE }, canActivate: [authGuard] },
  { path: 'account/read-only/:id', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.READONLY_STATE }, canActivate: [authGuard] },
  { path: 'match', component: MatchComponent, canActivate: [authGuard]},
  { path: 'match-room/owner', component: MatchRoomComponent, data: { state: MATCH_ROOM_STATE_KEYS.OWNER_STATE }, canActivate: [authGuard] },
  { path: 'match-room/participant', component: MatchRoomComponent, data: { state: MATCH_ROOM_STATE_KEYS.PARTICIPANT_STATE }, canActivate: [authGuard] },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page

];
