import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AccountComponent} from "./account/account.component";
import {MatchComponent} from "./match/match.component";
import {ACCOUNT_STATE_KEYS} from "./core/keys/account-state-keys";
import {MATCH_ROOM_STATE_KEYS} from "./core/keys/match-room-keys";
import {MatchRoomComponent} from "./match-room/match-room.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  { path: 'account/create', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.CREATE_STATE } },
  { path: 'account/update/:id', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.UPDATE_STATE } },
  { path: 'account/read-only/:id', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.READONLY_STATE } },
  { path: 'match', component: MatchComponent},
  { path: 'match-room/owner', component: MatchRoomComponent, data: { state: MATCH_ROOM_STATE_KEYS.OWNER_STATE } },
  { path: 'match-room/participant', component: MatchRoomComponent, data: { state: MATCH_ROOM_STATE_KEYS.PARTICIPANT_STATE } }
];

