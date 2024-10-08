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
import {MatchService} from "../core/integration/match.service";
import {DialogService} from "../core/dialog/dialog.service";
import {AlertService} from "../core/alert/alert.service";
import {UIServiceParams} from "../core/integration/ui-features/ui-service-params";
import {IntegrationUiService} from "../core/integration/ui-features/integration-ui.service";

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
  isLoading: boolean = false;

  constructor(
    private factoryService: FactoryService,
    private routingService: RoutingService,
    private matchService: MatchService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private integrationUIService: IntegrationUiService
  ) {
    this.matchForm = this.factoryService.getFormFactory().createMatchForm();
  }
  onSubmit() {
    if (this.matchForm.valid) {
      this.dialogService.confirmActionByDialog('create this match')
        .subscribe((result: boolean) => {
          if (result) {
            this.onConfirmCreateMatch(this.matchForm);
          }
        });
    }
  }

  routeBackToHome() {
    this.routingService.redirectTo('home', false);
  }

  private onConfirmCreateMatch(matchForm: FormGroup) {
    let params = UIServiceParams.builder().withLoadingDialog().withSuccessAlert().withErrorAlert();
    let operation  =  this.matchService.createMatch(matchForm);
    this.integrationUIService
      .executeCall<string>(operation, params)
      .subscribe((matchId) => {
          if (matchId) {
            this.matchService.storeMatchId(matchId);
            this.routingService.redirectTo('home', false);
          }
        }
      );
  }
}
