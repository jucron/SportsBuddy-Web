import {Component, inject, model} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatchDialogComponent} from "../match-dialog/match-dialog.component";
import {Account} from "../../model/account";
import {Sports} from "../../model/sports";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {DateUtils} from "../../utils/dateUtils";
import {MatchService} from "../../integration/match.service";
import {DialogService} from "../dialog.service";


interface AccountDialogData {
  account: Account
}

@Component({
  selector: 'app-account-dialog',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf,
    MatButton,
    MatCard
  ],
  templateUrl: './account-dialog.component.html',
  styleUrl: './account-dialog.component.css'
})
export class AccountDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MatchDialogComponent>);
  readonly data = inject<AccountDialogData>(MAT_DIALOG_DATA);
  readonly account = model(this.data.account);

  protected readonly sports = Sports;

  constructor(private dialogService: DialogService,
              private matchService: MatchService) {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  getMyMatchDate() {
    return DateUtils.getDateLabel(this.account().myMatch!.date);
  }

  showMatchDialog(matchId: string) {
    this.onCloseClick();
    this.matchService.getMatch(matchId)
      .subscribe(match => {
        this.dialogService.showMatchDialog(match);
      });
  }

  getMyMatchId() {
    return this.account().myMatch!.id;
  }
}
