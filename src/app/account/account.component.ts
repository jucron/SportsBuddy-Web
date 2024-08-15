import {Component, OnInit} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {FormErrorComponent} from "../core/helper-components/form-error/form-error.component";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {LoginService} from "../core/integration/login.service";
import {RoutingService} from "../core/routing/routing.service";
import {Account} from "../core/model/account";
import {MatCheckbox} from "@angular/material/checkbox";
import {Sports} from "../core/model/sports";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {AccountState, CreateState, ReadOnlyState, UpdateState} from "../core/model/account-state/accountState";
import {FactoryService} from "../core/factory/factory.service";
import {ACCOUNT_STATE_KEYS} from "../core/keys/account-state-keys";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FlexModule,
    FormErrorComponent,
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatToolbar,
    MatTooltip,
    ReactiveFormsModule,
    MatCheckbox,
    NgForOf,
    KeyValuePipe
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  accountForm: FormGroup;
  sports = Sports;
  sportsSelected: Sports[];
  protected currentState: AccountState;

  constructor(
    private factoryService: FactoryService,
    private loginService: LoginService,
    private routingService: RoutingService,
  ) {
    this.accountForm = this.factoryService.getFormFactory().createAccountForm();
    this.sportsSelected = [];
    this.currentState = new ReadOnlyState();
  }

  ngOnInit(): void {
    this.setCurrentStateBasedOnRoute();
  }
  onSubmit() {
    if (this.accountForm.valid) {
      let account: Account = this.accountForm.value;
      account.favouriteSports = this.sportsSelected;
      this.loginService.createAccount(account);
      this.routeToLogin();
    }
  }

  routeToLogin() {
    this.routingService.redirectTo('', false);
  }

  isSportSelected(sport: Sports): boolean {
    return this.sportsSelected.includes(sport);
  }
  toggleFavouriteSport(sport: Sports) {
    const index = this.sportsSelected.indexOf(sport);
    if (index > -1) {
      this.sportsSelected.splice(index, 1); // Remove the sport if it's already selected
    } else {
      this.sportsSelected.push(sport); // Add the sport if it's not selected
    }
  }

  setCurrentStateBasedOnRoute(){
    this.routingService.getActivatedRoute().data
      .subscribe(data => {
        switch (data['state']) {
          case ACCOUNT_STATE_KEYS.CREATE_STATE:
            this.currentState = new CreateState();
            break;
          case ACCOUNT_STATE_KEYS.UPDATE_STATE:
            this.currentState = new UpdateState();
            break;
          default:
            this.currentState = new ReadOnlyState();
            break;
        }
      });
  }
}
