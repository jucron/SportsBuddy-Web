import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AccountComponent} from "./account/account.component";
import {MatchComponent} from "./match/match.component";
import {ACCOUNT_STATE_KEYS} from "./core/keys/account-state-keys";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  { path: 'account/create', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.CREATE_STATE } },
  { path: 'account/update', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.UPDATE_STATE } },
  { path: 'account/read-only', component: AccountComponent, data: { state: ACCOUNT_STATE_KEYS.READONLY_STATE } },
  {path: 'match', component: MatchComponent}
];

