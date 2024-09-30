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
              private matchService: MatchService
  ) {}
  ngOnInit(): void {
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
          let matchRequestDecision: MatchRequestDecision = {matchRequest, accept};
          this.matchService.matchRequestDecision(matchRequestDecision);
          this.onCloseClick();
        }
      })
  }
}
