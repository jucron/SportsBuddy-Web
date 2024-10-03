import {AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {AccountFormFactory, AccountFormFactoryCreate, AccountFormFactoryUpdate} from "./AccountFormFactory";
import {PageState} from "../model/pageState";
import {DateUtils} from "../utils/dateUtils";

export class FormFactory {
  private requiredValidation = Validators.required;  // Must be filled

  constructor(private fb: FormBuilder) {}
  createLoginForm(){
    return this.fb.group({
      username: ['', this.requiredValidation],
      password: ['', this.requiredValidation]
    });
  }
  createAccountForm(state: PageState){
    let accountForm: AccountFormFactory = state.isCreateState() ? new AccountFormFactoryCreate(this.fb):new AccountFormFactoryUpdate(this.fb);
    return accountForm.createAccountForm();
  }
  createMatchForm(){
    return this.fb.group({
      name: ['', this.requiredValidation],
      date: ['', [this.requiredValidation, this.dateAtLeastTomorrowValidator()]],
      time: ['', this.requiredValidation],
      location: ['', this.requiredValidation],
      comments: ['', this.requiredValidation],
      sport: ['', this.requiredValidation]
    });
  }
  createMatchRequestForm(){
    return this.fb.group({
      comment: ['', this.requiredValidation],
    });
  }
  private dateAtLeastTomorrowValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const tomorrow = DateUtils.getTomorrow();

      if (selectedDate < tomorrow) {
        return { dateInvalid: 'The date must be at least tomorrow.' };
      }
      return null;
    };
  }

  createChatRoomForm() {
    return this.fb.group({
      text: [''],
    });
  }
}
