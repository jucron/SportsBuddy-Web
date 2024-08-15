import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class FormFactory {
  private requiredValidation = Validators.required;  // Must be filled
  private emailValidation =  [
    Validators.required,
    Validators.email
  ];
  private passwordValidation = [
    Validators.required, // Password must be filled
    Validators.minLength(8), // Password must be at least 8 characters long
    Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*._])/), // Must contain at least one number and one special character
  ];

  constructor(private fb: FormBuilder) {}
  createLoginForm(){
    let loginForm: FormGroup = this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.requiredValidation]
    });
    return loginForm;
  }
  createAccountForm(){
    return this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.passwordValidation],
      name: ['', this.requiredValidation],
      email: ['', this.emailValidation]
  });
  }

  createMatchForm(){
    return this.fb.group({
      name: ['', this.requiredValidation],
      date: ['', this.requiredValidation],
      hour: ['', this.requiredValidation],
      // location: ['', this.requiredValidation],
      // comments: ['', this.requiredValidation],
      // sport: ['', this.requiredValidation]
    });
  }

}
