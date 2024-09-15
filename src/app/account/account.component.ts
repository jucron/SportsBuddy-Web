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
import {AccountService} from "../core/integration/account.service";
import {RoutingService} from "../core/routing/routing.service";
import {Account} from "../core/model/account";
import {MatCheckbox} from "@angular/material/checkbox";
import {Sports} from "../core/model/sports";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {CreateState, PageState, ReadOnlyState, UpdateState} from "../core/model/pageState";
import {FactoryService} from "../core/factory/factory.service";
import {ACCOUNT_STATE_KEYS} from "../core/keys/account-state-keys";
import {ActivatedRoute} from "@angular/router";

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
  accountForm!: FormGroup;
  sports = Sports;
  sportsSelected: Sports[];
  protected currentState: PageState;


  constructor(
    private factoryService: FactoryService,
    private loginService: AccountService,
    private routingService: RoutingService,
    private activatedRoute: ActivatedRoute
  ) {
    this.sportsSelected = [];
    this.currentState = new ReadOnlyState();
    this.accountForm = this.factoryService.getFormFactory().createAccountForm(this.currentState);
  }

  ngOnInit(): void {
    this.setCurrentStateBasedOnRouteData();
    this.loadAccountData();
  }
  onSubmit() {
    if (this.accountForm && this.accountForm.valid) {
      let account: Account = this.accountForm.value;
      account.favouriteSports = this.sportsSelected;

      if (this.currentState.isCreateState()) {
        this.loginService.createAccount(account);
      } else{
        //todo
        // this.loginService.updateAccount(account);
      }
      this.clickReturnButton();
    }
  }
  clickReturnButton() {
    if (this.currentState.isCreateState()) {
      this.routingService.redirectTo('', false);
    } else {
      this.routingService.redirectTo('home', false);
    }
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
  private setCurrentStateBasedOnRouteData(){
    this.activatedRoute.data
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
  private loadAccountData() {
    const accountId = this.activatedRoute.snapshot.paramMap.get('id');
    if (accountId != null) {
      this.loginService.getAccount(accountId)
        .subscribe({
          next: (account: Account | null) => {
            if (account && this.accountForm) {
              this.accountForm.patchValue(
                {
                  id: account?.id,
                  username: account?.username,
                  name: account?.name,
                  email: account?.email,
                  favouriteSports:account?.favouriteSports
                }
              );
              this.sportsSelected = account.favouriteSports;
            }
          },
          error: (err) => {
            console.error('Error loading account - integration error', err);
          }
        });
    } else {
      console.error('Error loading account - account not found with current Id');
    }
  }
  getSubmitButtonLabel(): string {
    return this.currentState.isCreateState() ? 'Create' : 'Update';
  }
  getReturnButtonLabel(): string {
    return this.currentState.isReadOnlyState() ? 'Go back' : 'Cancel';
  }
}
