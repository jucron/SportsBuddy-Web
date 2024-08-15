import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AccountComponent} from "./account/account.component";
import {MatchComponent} from "./match/match.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  { path: 'account/create', component: AccountComponent, data: { state: 'create' } },
  { path: 'account/update', component: AccountComponent, data: { state: 'update' } },
  { path: 'account/view', component: AccountComponent, data: { state: 'readOnly' } },
  {path: 'match', component: MatchComponent}
];

