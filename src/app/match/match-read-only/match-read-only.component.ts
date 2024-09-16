import {Component, Input, OnInit} from '@angular/core';
import {DateUtils} from "../../core/utils/dateUtils";
import {Sports} from "../../core/model/sports";
import {Match} from "../../core/model/match";
import {MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../../core/dialog/dialog.service";
import {AccountService} from "../../core/integration/account.service";
import {NgForOf} from "@angular/common";
import {MatchService} from "../../core/integration/match.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-match-read-only',
  standalone: true,
  imports: [
    NgForOf,
    MatProgressSpinner
  ],
  templateUrl: './match-read-only.component.html',
  styleUrl: './match-read-only.component.css'
})
export class MatchReadOnlyComponent implements OnInit{
  @Input() match!: Match;
  @Input() matchId: string | null = null;
  @Input() dialogRef: MatDialogRef<any> | null = null;
  isMatchLoading = true;

  protected readonly DateUtils = DateUtils;

  constructor(private dialogService: DialogService,
              private accountService: AccountService,
              private matchService: MatchService)
  {  }

  ngOnInit(): void {
    if (this.matchId) {
      this.matchService.getMatch(this.matchId)
        .subscribe(match => {
          this.match = match!;
          this.isMatchLoading = false;
        });
    } else {
      this.isMatchLoading = false;
    }
  }
  getParticipants() {
    return this.match.participants.map(participant => ({
      name: participant.name,
      id: participant.id
    }));
  }
  getSportIcon() {
    switch (this.match.sport) {
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
  showAccountDialog(accountId: string) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    const account = this.accountService.getAccount(accountId)
      .subscribe(account => {
        this.dialogService.showAccountDialog(account!);
      });
  }


}
