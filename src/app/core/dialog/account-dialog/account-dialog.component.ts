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
import {AlertService} from "../../alert/alert.service";
import {UIServiceParams} from "../../integration/ui-features/ui-service-params";
import {Match} from "../../model/match";
import {IntegrationUiService} from "../../integration/ui-features/integration-ui.service";


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
              private alertService: AlertService,
              private integrationUIService: IntegrationUiService) {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  getMyMatchDate() {
    return DateUtils.getDateLabel(this.account().myMatch!.date);
  }

  showMatchDialog(matchId: string) {
    let params = UIServiceParams.builder().withErrorAlert().withLoadingDialog();
    let operation = this.matchService.getMatch(matchId);
    this.integrationUIService
      .executeCall<Match>(operation, params)
      .subscribe((match) => {
        if (match) {
          this.onCloseClick();
          this.dialogService.showMatchDialog(match);
        }
      });
  }

  getMyMatchId() {
    return this.account().myMatch!.id;
  }
}
