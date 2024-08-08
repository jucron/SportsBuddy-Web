import {Component,  Input, OnInit} from '@angular/core';
import {MatError} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [
    MatError,
    NgIf
  ],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.css'
})
export class FormErrorComponent implements OnInit{
  @Input() control: any;

  errorMessage: string;

  constructor() {
    this.errorMessage = '';
  }

  ngOnInit() {
    this.control.statusChanges.subscribe(() => {
      this.setErrorMessage();
    });
    this.setErrorMessage();
  }

  private setErrorMessage() {
    if (this.control instanceof FormControl) {
      const errors = this.control.errors;
      if (errors) {
        if (errors['required']) {
          // this.errorMessage = 'You must enter a value';
          this.errorMessage = '';
        } else if (errors['minlength']) {
          const minLength = errors['minlength'].requiredLength;
          this.errorMessage = `Minimum length is ${minLength} characters`;
        } else if (errors['pattern']) {
          this.errorMessage = 'You must enter at least one special character';
        }
        // Add more error types as needed
      }
    }
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
