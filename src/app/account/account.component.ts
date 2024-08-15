import { Component } from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {FormErrorComponent} from "../core/helper-components/form-error/form-error.component";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../core/integration/login.service";
import {RoutingService} from "../core/routing/routing.service";
import {Account} from "../core/model/account";
import {MatCheckbox} from "@angular/material/checkbox";
import {Sports} from "../core/model/sports";
import {KeyValuePipe, NgForOf} from "@angular/common";

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
export class AccountComponent {
  accountForm: FormGroup;
  private requiredValidation = Validators.required;  // must be filled
  private emailValidation =  [
    Validators.required,
    Validators.email
  ];
  private passwordValidation = [
    Validators.required, // Password must be filled
    Validators.minLength(8), // Password must be at least 8 characters long
    Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*._])/), // Must contain at least one number and one special character
  ];
  sports = Sports;
  sportsSelected: Sports[];

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private routingService: RoutingService
  ) {
    this.accountForm = this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.passwordValidation],
      name: ['', this.requiredValidation],
      email: ['', this.emailValidation]
    });
    this.sportsSelected = []
  }


  onSubmit() {
    if (this.accountForm.valid) {
      let account: Account = this.accountForm.value;
      account.favouriteSports = this.sportsSelected;
      // console.log('account created:\n'+JSON.stringify(account))
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

}
