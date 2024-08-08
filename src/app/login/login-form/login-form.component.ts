import { Component } from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
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
    FormErrorComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  private usernameValidation = Validators.required;  // Username must be filled
  private passwordValidation = [
    Validators.required, // Password must be filled
    Validators.minLength(8), // Password must be at least 8 characters long
    Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*._])/), // Must contain at least one number and one special character
  ];


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['username', this.usernameValidation],
      password: ['password', this.passwordValidation]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log('Login', { username, password });
    }
  }
}
