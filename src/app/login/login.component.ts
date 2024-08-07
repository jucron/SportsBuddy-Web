import { Component } from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {NgOptimizedImage} from "@angular/common";
import {LoginFormComponent} from "./login-form/login-form.component";
import {FlexModule, GridModule} from "@angular/flex-layout";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    NgOptimizedImage,
    LoginFormComponent,
    GridModule,
    FlexModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
