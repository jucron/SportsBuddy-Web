import {Component, inject, model} from '@angular/core';
import {MatchComponent} from "../../../match/match.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {MatTooltip} from "@angular/material/tooltip";
import {Match} from "../../model/match";
import {MatCard, MatCardContent} from "@angular/material/card";
import {DateUtils} from "../../utils/dateUtils";
import {FormErrorComponent} from "../../helper-components/form-error/form-error.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FactoryService} from "../../factory/factory.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatchService} from "../../integration/match.service";
import {MatchReadOnlyComponent} from "../../../match/match-read-only/match-read-only.component";
import {RoutingService} from "../../routing/routing.service";
import {DialogService} from "../dialog.service";
import {AccountService} from "../../integration/account.service";
import {AlertService} from "../../alert/alert.service";
import {finalize} from "rxjs";

interface MatchDialogData {
  match: Match
}

@Component({
  selector: 'app-match-dialog',
  standalone: true,
  imports: [
    MatchComponent,
    MatButton,
    FlexModule,
    MatTooltip,
    MatCard,
    FormErrorComponent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgIf,
    MatCardContent,
    NgForOf,
    MatchReadOnlyComponent
  ],
  templateUrl: './match-dialog.component.html',
  styleUrl: './match-dialog.component.css'
})

export class MatchDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MatchDialogComponent>);
  readonly data = inject<MatchDialogData>(MAT_DIALOG_DATA);
  readonly match = model(this.data.match);
  loggedUserId;
  showFiller = false;
  matchRequestForm: FormGroup;
  protected readonly DateUtils = DateUtils;

  constructor(private factoryService: FactoryService,
              private matchService: MatchService,
              private routingService: RoutingService,
              private dialogService: DialogService,
              private accountService: AccountService,
              private alertService: AlertService,
  ) {
    this.loggedUserId = this.accountService.getLoggedAccountId();
    this.matchRequestForm = this.factoryService.getFormFactory().createMatchRequestForm();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  isButtonAskToParticipateDisabled() {
    return this.showFiller || this.isUserOwner() || this.isUserRequesting() || this.isUserParticipating();
  }
  isUserRequesting(): boolean {
    return this.match().matchRequests.some(request =>
      request.userIdRequested === this.loggedUserId);
  }
  isUserOwner(){
    return this.match().owner!.id === this.loggedUserId;
  }
  isUserParticipating(): boolean {
    return this.match().participants.some(participant =>
      participant.id === this.loggedUserId);
  }
  getMatchRequestDate() {
    let date = this.match().matchRequests.find(request => {
      return request.userIdRequested === this.loggedUserId
    })?.date;
    if (date) {
      return DateUtils.getDateLabel(date)+', '+DateUtils.getTimeLabel(date);
    }
    return '';
  }
  changeFiller() {
    this.showFiller = !this.showFiller;
  }
  onSubmit() {
    if (this.matchRequestForm.valid) {
      this.dialogService.confirmActionByDialog('ask to participate in this match')
        .subscribe((result: boolean) => {
          if (result) {
            this.onConfirmAskToParticipate();
          }
        });
    }
  }

  goToMatchRoom() {
    this.onCloseClick();
    this.routingService.redirectTo('match-room/'+this.match().id+'/participant', false);
  }

  goToMyMatchRoom() {
    this.onCloseClick();
    this.routingService.redirectTo('match-room/'+this.match().id+'/owner', false);
  }

  private onConfirmAskToParticipate() {
    this.dialogService.showLoadingDialog();
    this.matchService.matchRequest(this.matchRequestForm, this.loggedUserId ?? 'not-found', this.match())
      .pipe(
        finalize(() => this.dialogService.closeLoadingDialog())
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.alertService.alertMatchRequestSuccess();
            this.routingService.redirectTo('home', false);
          } else {
            this.alertService.alertMatchRequestFailed();
          }
        },
        error: err => {
          console.error('matchRequest failed', err);
          this.alertService.alertMatchRequestFailed();
        }
      });
    this.onCloseClick();
  }
}
