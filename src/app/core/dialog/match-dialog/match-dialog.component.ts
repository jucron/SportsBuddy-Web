import {Component, inject, model} from '@angular/core';
import {MatchComponent} from "../../../match/match.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {MatTooltip} from "@angular/material/tooltip";
import {Match} from "../../model/match";
import {MatCard, MatCardContent} from "@angular/material/card";
import {DateUtils} from "../../utils/dateUtils";
import {Sports} from "../../model/sports";
import {STORAGE_KEYS} from "../../keys/storage-keys";
import {FormErrorComponent} from "../../helper-components/form-error/form-error.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FactoryService} from "../../factory/factory.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatchService} from "../../integration/match.service";
import {MatchRequest} from "../../model/requests/matchRequest";
import {DialogService} from "../dialog.service";
import {AccountService} from "../../integration/account.service";

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
    NgForOf
  ],
  templateUrl: './match-dialog.component.html',
  styleUrl: './match-dialog.component.css'
})
export class MatchDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MatchDialogComponent>);
  readonly data = inject<MatchDialogData>(MAT_DIALOG_DATA);
  readonly match = model(this.data.match);
  loggedUsername =  localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME);
  showFiller = false;
  matchRequestForm: FormGroup;
  protected readonly DateUtils = DateUtils;

  constructor(private factoryService: FactoryService,
              private matchService: MatchService,
              private dialogService: DialogService,
              private accountService: AccountService
  ) {
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
      request.usernameRequested === this.loggedUsername);
  }
  isUserOwner(){
    return this.match().owner!.username === this.loggedUsername;
  }
  isUserParticipating(): boolean {
    return this.match().participants.some(participant =>
      participant.username === this.loggedUsername);
  }
  getParticipants() {
    return this.match().participants.map(participant => ({
      name: participant.name,
      id: participant.id
    }));
  }
  getSportIcon() {
    switch (this.match().sport) {
      case Sports.soccer:
        return '⚽';
      case Sports.basketball:
        return '🏀';
      case Sports.volleyball:
        return '🏐';
      case Sports.baseball:
        return '⚾';
      case Sports.tennis:
        return '🎾';
      default:
        return '🏓';
    }
  }
  getMatchRequestDate() {
    let date = this.match().matchRequests.find(request => {
      return request.usernameRequested === this.loggedUsername
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
      let matchRequest: MatchRequest = this.matchRequestForm.value;
      matchRequest.usernameRequested = this.loggedUsername ?? 'not-found';
      matchRequest.date = new Date();
      matchRequest.usernameOwner = this.match().owner!.username;
      console.log('matchRequest: '+JSON.stringify(matchRequest))
      this.matchService.matchRequest(matchRequest);
    }
    this.onCloseClick();
  }
  showAccountDialog(accountId: string) {
    this.onCloseClick();
    const account = this.accountService.getAccount(accountId)
      .subscribe(account => {
        this.dialogService.showAccountDialog(account!);
      });
  }
}
