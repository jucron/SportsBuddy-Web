import { Component } from '@angular/core';
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard} from "@angular/material/card";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {FormErrorComponent} from "../../core/form-error/form-error.component";
import {LoginService} from "../../core/integration/login.service";
import {Credentials} from "../../core/model/credentials";
import {RoutingService} from "../../core/routing/routing.service";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatToolbar,
    MatTooltip,
    MatError,
    NgIf,
    FormErrorComponent,
    MatHint
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  private requiredValidation = Validators.required;  // Username must be filled

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private routingService: RoutingService
  ) {
    this.loginForm = this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.requiredValidation]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let credentials: Credentials = this.loginForm.value;
      this.loginService.executeLogin(credentials);
    }
  }

  routeToCreateAccount() {
    this.routingService.redirectTo('account', false);
  }
}
