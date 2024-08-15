import {Component} from '@angular/core';
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard} from "@angular/material/card";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {FormErrorComponent} from "../../core/helper-components/form-error/form-error.component";
import {LoginService} from "../../core/integration/login.service";
import {Credentials} from "../../core/model/credentials";
import {RoutingService} from "../../core/routing/routing.service";
import {FactoryService} from "../../core/factory/factory.service";

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
  isLoadingLogin: boolean;

  constructor(
    private factoryService: FactoryService,
    private loginService: LoginService,
    private routingService: RoutingService
  ) {
    this.loginForm = this.factoryService.getFormFactory().createLoginForm();
    this.isLoadingLogin = this.loginService.isLoading;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let credentials: Credentials = this.loginForm.value;
      this.loginService.executeLogin(credentials);
    }
  }

  routeToCreateAccount() {
    this.routingService.redirectTo('account/create', false);
  }
}
