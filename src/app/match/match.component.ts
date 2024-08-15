import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {FormErrorComponent} from "../core/helper-components/form-error/form-error.component";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RoutingService} from "../core/routing/routing.service";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {Sports} from "../core/model/sports";

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    FlexModule,
    FormErrorComponent,
    KeyValuePipe,
    MatButton,
    MatCard,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatToolbar,
    MatTooltip,
    NgForOf,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatRadioGroup,
    MatRadioButton,
    MatHint,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  matchForm: FormGroup;
  private requiredValidation = Validators.required;  // Must be filled

  constructor(
    private fb: FormBuilder,
    private routingService: RoutingService
  ) {
    this.matchForm = this.fb.group({
      name: ['', this.requiredValidation],
      date: ['', this.requiredValidation],
      hour: ['', this.requiredValidation],
      // location: ['', this.requiredValidation],
      // comments: ['', this.requiredValidation],
      // sport: ['', this.requiredValidation]
    });
  }
  onSubmit() {
    if (this.matchForm.valid) {
      // let credentials: Credentials = this.loginForm.value;
      // this.loginService.executeLogin(credentials);
    }
  }

  routeBackToHome() {
    this.routingService.redirectTo('home', false);
  }

  protected readonly sports = Sports;
}
