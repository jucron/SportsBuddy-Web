import {Injectable} from '@angular/core';
import {FormFactory} from "./formFactory";
import {FormBuilder} from "@angular/forms";
import {NotificationFactory} from "./notificationFactory";

@Injectable({
  providedIn: 'root'
})
export class FactoryService {
  private formFactory: FormFactory;
  private notificationFactory: NotificationFactory;

  constructor(private fb: FormBuilder) {
    this.formFactory = new FormFactory(fb);
    this.notificationFactory = new NotificationFactory();
  }
  getFormFactory() {
    return this.formFactory;
  }
  getNotificationFactory() {
    return this.notificationFactory;
  }
}
