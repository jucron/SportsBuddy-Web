import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";
import {mockHttpInterceptorInterceptor} from "./core/integration/mock-http-interceptor.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([mockHttpInterceptorInterceptor]))
  ,provideNativeDateAdapter()
  ]
};
