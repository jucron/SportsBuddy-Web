import {Component} from '@angular/core';
import {MatDialogContent} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.css'
})
export class LoadingDialogComponent {

}
