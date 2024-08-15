import {Injectable} from '@angular/core';
import {LoadingDialogComponent} from "./loading-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {
  private dialogRef: MatDialogRef<LoadingDialogComponent> | null = null;

  constructor(private dialog: MatDialog) { }
  showLoadingDialog(): void {
    this.dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true, // Prevent closing the dialog by clicking outside
      panelClass: 'loading-dialog-container'
    });
  }
  closeLoadingDialog(){
    /**
     * Note that we can ignore the initialization of dialogRef since it will always be populated by showLoadingDialog()
     */
    // @ts-ignore
    this.dialogRef.close();
  }
}
