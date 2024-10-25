import {Component, Input, OnInit} from '@angular/core';
import {DateUtils} from "../../core/utils/dateUtils";
import {Sports} from "../../core/model/sports";
import {Match} from "../../core/model/match";
import {MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../../core/dialog/dialog.service";
import {AccountService} from "../../core/integration/account.service";
import {NgForOf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UIServiceParams} from "../../core/integration/ui-features/ui-service-params";
import {Account} from "../../core/model/account";
import {IntegrationUiService} from "../../core/integration/ui-features/integration-ui.service";

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
  @Input() match: Match | null = null;
  @Input() dialogRef: MatDialogRef<any> | null = null;

  protected readonly DateUtils = DateUtils;

  constructor(private dialogService: DialogService,
              private accountService: AccountService,
              private integrationUIService: IntegrationUiService)
  {  }

  ngOnInit(): void {
  }
  getParticipants() {
    return this.match?.participants.map(participant => ({
      name: participant.name,
      id: participant.id
    }));
  }
  getSportIcon() {
    switch (this.match?.sport) {
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
    let params = UIServiceParams.builder().withLoadingDialog().withErrorAlert();
    let operation = this.accountService.getAccount(accountId);
    return this.integrationUIService
      .executeCall<Account>(operation, params)
      .subscribe(account => {
        if (account) {
          this.dialogService.showAccountDialog(account);
        }
      });
  }

}
