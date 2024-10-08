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
import {finalize} from "rxjs";
import {AlertService} from "../../alert/alert.service";


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
  isLoading: boolean = false;

  protected readonly sports = Sports;

  constructor(private dialogService: DialogService,
              private matchService: MatchService,
              private alertService: AlertService) {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  getMyMatchDate() {
    return DateUtils.getDateLabel(this.account().myMatch!.date);
  }

  showMatchDialog(matchId: string) {
    this.isLoading = true;
    this.dialogService.showLoadingDialog()
    this.onCloseClick();
    this.matchService.getMatch(matchId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.dialogService.closeLoadingDialog();
        })
      )
      .subscribe({
        next: (match) => {
          if (match) {
            // this.dialogService.showMatchDialog(match);
          } else {
            this.alertService.alertGetMatchError();
          }
        },
        error: err => {
          console.error('showMatchDialog failed', err);
          this.alertService.alertGetMatchError();
        }
      });
  }

  getMyMatchId() {
    return this.account().myMatch!.id;
  }
}
