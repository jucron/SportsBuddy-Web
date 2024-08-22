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
    MatCard
  ],
  templateUrl: './match-dialog.component.html',
  styleUrl: './match-dialog.component.css'
})
export class MatchDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MatchDialogComponent>);
  readonly data = inject<MatchDialogData>(MAT_DIALOG_DATA);
  readonly match = model(this.data.match);

  onCloseClick(): void {
    this.dialogRef.close();
  }

  isUserParticipating() {
    return false;
  }

  protected readonly DateUtils = DateUtils;

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
}
