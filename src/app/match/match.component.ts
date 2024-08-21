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
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RoutingService} from "../core/routing/routing.service";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {Sports} from "../core/model/sports";
import {FactoryService} from "../core/factory/factory.service";
import {Match} from "../core/model/match";
import {DateUtils} from "../core/utils/dateUtils";

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
  protected readonly sports = Sports;

  constructor(
    private factoryService: FactoryService,
    private routingService: RoutingService
  ) {
    this.matchForm = this.factoryService.getFormFactory().createMatchForm();
  }
  onSubmit() {
    if (this.matchForm.valid) {
      const date = this.matchForm.get('date')?.value;
      const time = this.matchForm.get('time')?.value;
      const combinedDateTime = DateUtils.getCombinedDateTime(date,time);
      console.log(combinedDateTime);
      let match: Match = this.matchForm.value;
      match.date = combinedDateTime ?? match.date;
      console.log(JSON.stringify(match));
      //todo: createMatch()

      // let credentials: Credentials = this.loginForm.value;
      // this.loginService.executeLogin(credentials);
    }
  }

  routeBackToHome() {
    this.routingService.redirectTo('home', false);
  }
}
