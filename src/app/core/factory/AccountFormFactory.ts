import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export abstract class AccountFormFactory {
  protected requiredValidation = Validators.required;
  protected emailValidation = [
    Validators.required,
    Validators.email
  ];
  protected passwordValidation = [
    Validators.required, // Password must be filled
    Validators.minLength(8), // Password must be at least 8 characters long
    Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*._])/), // Must contain at least one number and one special character
  ];

  abstract createAccountForm(): FormGroup;
}
export class AccountFormFactoryCreate extends AccountFormFactory {
  constructor(private fb: FormBuilder) {
    super();
  }

  createAccountForm() {
    return this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.passwordValidation],
      name: ['', this.requiredValidation],
      email: ['', this.emailValidation]
    });
  }
}
export class AccountFormFactoryUpdate extends AccountFormFactory{
  constructor(private fb: FormBuilder) {
    super();
  }
  createAccountForm() {
    return this.fb.group({
      name: ['', this.requiredValidation],
      email: ['', this.emailValidation]
    });
  }
}
