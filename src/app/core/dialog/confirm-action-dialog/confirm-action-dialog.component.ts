import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";

interface ConfirmActionDialogData {
  action: string
}
@Component({
  selector: 'app-confirm-action-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    FlexModule
  ],
  templateUrl: './confirm-action-dialog.component.html',
  styleUrl: './confirm-action-dialog.component.css'
})
export class ConfirmActionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmActionDialogData>);
  readonly data = inject<ConfirmActionDialogData>(MAT_DIALOG_DATA);

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
