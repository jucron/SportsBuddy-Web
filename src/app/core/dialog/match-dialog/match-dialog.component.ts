import {Component, inject, model} from '@angular/core';
import {MatchComponent} from "../../../match/match.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {MatTooltip} from "@angular/material/tooltip";
import {Match} from "../../model/match";
import {MatCard} from "@angular/material/card";
import {DateUtils} from "../../utils/dateUtils";
import {Sports} from "../../model/sports";
import {STORAGE_KEYS} from "../../keys/storage-keys";
import {FormErrorComponent} from "../../helper-components/form-error/form-error.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FactoryService} from "../../factory/factory.service";

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
    ReactiveFormsModule
  ],
  templateUrl: './match-dialog.component.html',
  styleUrl: './match-dialog.component.css'
})
export class MatchDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MatchDialogComponent>);
  readonly data = inject<MatchDialogData>(MAT_DIALOG_DATA);
  readonly match = model(this.data.match);
  loggedUser =  localStorage.getItem(STORAGE_KEYS.MAIN_USERNAME);
  showFiller = false;
  matchRequestForm: FormGroup;
  protected readonly DateUtils = DateUtils;

  constructor(private factoryService: FactoryService) {
    this.matchRequestForm = this.factoryService.getFormFactory().createMatchRequestForm();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  isUserParticipating(): boolean {
    return this.match().matchRequests.some(request =>
      request.user.username === this.loggedUser);
  }
  getParticipants() {
    let participants = '';
    let separator = ', ';
    this.match().participants.forEach(p => {
      if (this.match().participants.indexOf(p)+1 === this.match().participants.length) {
        separator = '.';
      }
      participants = participants+p.name+separator;
    });
    return participants;
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
      return request.user.username === this.loggedUser
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
    //todo
  }
}
