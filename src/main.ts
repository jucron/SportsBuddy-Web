import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {environment} from "./app/core/environments/environments";

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

//console logs are enabled based on environment variable
if (!environment.enableConsoleLogs) {
  console.log = function () { };
  console.warn = function () { };
  console.error = function () { };
}
