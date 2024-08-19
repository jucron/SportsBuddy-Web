import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountFormFactory, AccountFormFactoryCreate, AccountFormFactoryUpdate} from "./AccountFormFactory";
import {AccountState} from "../model/account-state/accountState";

export class FormFactory {
  private requiredValidation = Validators.required;  // Must be filled

  constructor(private fb: FormBuilder) {}
  createLoginForm(){
    let loginForm: FormGroup = this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.requiredValidation]
    });
    return loginForm;
  }
  createAccountForm(state: AccountState){
    let accountForm: AccountFormFactory = state.isCreateState() ? new AccountFormFactoryCreate(this.fb):new AccountFormFactoryUpdate(this.fb);
    return accountForm.createAccountForm();
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
