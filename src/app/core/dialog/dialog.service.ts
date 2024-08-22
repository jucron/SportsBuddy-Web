import {Injectable} from '@angular/core';
import {LoadingDialogComponent} from "./loading-dialog/loading-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatchDialogComponent} from "./match-dialog/match-dialog.component";
import {Match} from "../model/match";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent> | null = null;
  private matchDialogRef: MatDialogRef<MatchDialogComponent> | null = null;

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
    this.matchDialogRef = this.dialog.open(MatchDialogComponent, {
      data: {match: match},
      panelClass: 'match-dialog-container'
    });
  }
}
