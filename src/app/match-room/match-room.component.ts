import {Component, OnInit} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {FormErrorComponent} from "../core/helper-components/form-error/form-error.component";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {RoutingService} from "../core/routing/routing.service";
import {FactoryService} from "../core/factory/factory.service";
import {MatchService} from "../core/integration/match.service";
import {Match} from "../core/model/match";

@Component({
  selector: 'app-chat-room',
  standalone: true,
    imports: [
        FlexModule,
        FormErrorComponent,
        FormsModule,
        KeyValuePipe,
        MatButton,
        MatCard,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatInput,
        MatLabel,
        MatRadioButton,
        MatRadioGroup,
        MatSuffix,
        MatToolbar,
        MatTooltip,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './match-room.component.html',
  styleUrl: './match-room.component.css'
})
export class MatchRoomComponent implements OnInit {
  myMatch: Match | null = null;
  matchForm: FormGroup;

  constructor(private routeService: RoutingService,
              private factoryService: FactoryService,
              private matchService: MatchService) {
    this.matchForm = this.factoryService.getFormFactory().createMatchForm();
  }
  ngOnInit(): void {
    this.matchService.getMyMatch().subscribe((match: Match) => {
      this.myMatch = match;
    });
  }
  onSubmit() {

  }

  routeBackToHome() {
    this.routeService.redirectTo('home', false);
  }


}
