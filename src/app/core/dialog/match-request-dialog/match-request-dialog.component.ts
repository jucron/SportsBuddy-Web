import {Component, inject, model, OnInit} from '@angular/core';
import {MatchRequest} from "../../model/requests/matchRequest";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgForOf} from "@angular/common";
import {DialogService} from "../dialog.service";
import {AccountService} from "../../integration/account.service";
import {FlexModule} from "@angular/flex-layout";
import {MatButton} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {MatchService} from "../../integration/match.service";
import {MatchRequestDecision} from "../../model/requests/matchRequestDecision";
import {AlertService} from "../../alert/alert.service";
import {UIServiceParams} from "../../integration/ui-features/ui-service-params";
import {IntegrationUiService} from "../../integration/ui-features/integration-ui.service";
import {RoutingService} from "../../routing/routing.service";

interface MatchRequestData {
  matchRequests: MatchRequest[]
}
@Component({
  selector: 'app-match-request-dialog',
  standalone: true,
  imports: [
    NgForOf,
    FlexModule,
    MatButton,
    MatExpansionModule,
    MatIcon
  ],
  templateUrl: './match-request-dialog.component.html',
  styleUrl: './match-request-dialog.component.css'
})
export class MatchRequestDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MatchRequestDialogComponent>);
  readonly data: MatchRequestData = inject<MatchRequestData>(MAT_DIALOG_DATA);
  readonly matchRequests = model(this.data.matchRequests);

  constructor(private dialogService: DialogService,
              private accountService: AccountService,
              private matchService: MatchService,
              private alertService: AlertService,
              private integrationUIService: IntegrationUiService,
              private routingService: RoutingService)
  {}

  ngOnInit(): void {
    this.alertService.releaseCachedAlert()
  }

  showAccountDialog(userIdRequested: string) {
    this.accountService.getAccount(userIdRequested)
      .subscribe(account => {
        if (account) {
          this.dialogService.showAccountDialog(account);
        }
      });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }

  protected readonly JSON = JSON;

  matchRequestDecision(matchRequest: MatchRequest, accept: boolean) {
    let message = `${accept ? 'accept' : 'decline'} this match request?`;
    this.dialogService.confirmActionByDialog(message)
      .subscribe(result => {
        if (result) {
          let params = UIServiceParams.builder().withErrorAlert().withLoadingDialog();
          let matchRequestDecision: MatchRequestDecision = {matchRequest, accept};
          let operation = this.matchService.matchRequestDecision(matchRequestDecision);
          this.integrationUIService
            .executeCall<boolean>(operation, params)
            .subscribe((result) => {
                if (result) {
                  this.routingService.reloadPage();
                }
              },
            );
        }
        // this.onCloseClick();
      })
  }
}
