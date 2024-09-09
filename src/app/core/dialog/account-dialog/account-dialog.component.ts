import {Component, inject, model} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatchDialogComponent} from "../match-dialog/match-dialog.component";
import {Account} from "../../model/account";
import {Sports} from "../../model/sports";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";


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

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
