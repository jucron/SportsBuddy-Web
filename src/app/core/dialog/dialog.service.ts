import {Injectable} from '@angular/core';
import {LoadingDialogComponent} from "./loading-dialog/loading-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatchDialogComponent} from "./match-dialog/match-dialog.component";
import {Match} from "../model/match";
import {Account} from "../model/account";
import {AccountDialogComponent} from "./account-dialog/account-dialog.component";
import {ConfirmActionDialogComponent} from "./confirm-action-dialog/confirm-action-dialog.component";
import {map, Observable} from "rxjs";
import {MatchRequest} from "../model/requests/matchRequest";
import {MatchRequestDialogComponent} from "./match-request-dialog/match-request-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent> | null = null;
  // private matchDialogRef: MatDialogRef<MatchDialogComponent> | null = null;
  // private accountDialogRef: MatDialogRef<AccountDialogComponent> | null = null;

  constructor(private dialog: MatDialog) { }
  showLoadingDialog(): void {
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true, // Prevent closing the dialog by clicking outside
      panelClass: 'loading-dialog-container'
    });
  }
  closeLoadingDialog(){
    this.loadingDialogRef?.close();
  }
  showMatchDialog(match: Match): void {
    this.dialog.open(MatchDialogComponent, {
      data: {match: match},
      panelClass: 'match-dialog-container'
    });
  }
  showAccountDialog(account: Account): void {
    this.dialog.open(AccountDialogComponent, {
      data: {account: account},
      panelClass: 'account-dialog-container'
    });
  }
  confirmActionByDialog(action: String): Observable<boolean> {
    let dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      data: {action: action},
      panelClass: 'confirm-action-dialog-container'
    });
    return dialogRef.afterClosed()
      .pipe(
        map(result => {
          console.log('User decision: ', result);
          return result;
        })
      );
  }

  showMatchRequestsDialog(matchRequests: MatchRequest[]) {
    this.dialog.open(MatchRequestDialogComponent, {
      data: {matchRequests: matchRequests},
      panelClass: 'match-request-dialog-container'
    });
  }
}
