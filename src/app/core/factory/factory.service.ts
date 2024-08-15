import {Injectable} from '@angular/core';
import {FormFactory} from "./formFactory";
import {FormBuilder} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FactoryService {
  private formFactory: FormFactory;

  constructor(private fb: FormBuilder) {
    this.formFactory = new FormFactory(fb);
  }
  getFormFactory() {
    return this.formFactory;
  }
}
