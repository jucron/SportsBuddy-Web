import {Component, OnInit} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {FormErrorComponent} from "../core/helper-components/form-error/form-error.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {ActivatedRoute} from "@angular/router";
import {OwnerState, PageState, ParticipatingState, ReadOnlyState} from "../core/model/pageState";
import {MATCH_ROOM_STATE_KEYS} from "../core/keys/match-room-keys";
import {MatchRoomDetailsComponent} from "./match-room-details/match-room-details.component";
import {MatchDialogComponent} from "../core/dialog/match-dialog/match-dialog.component";
import {MatchReadOnlyComponent} from "../match/match-read-only/match-read-only.component";
import {STORAGE_KEYS} from "../core/keys/storage-keys";

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
    ReactiveFormsModule,
    MatchRoomDetailsComponent,
    MatchDialogComponent,
    MatchReadOnlyComponent
  ],
  templateUrl: './match-room.component.html',
  styleUrl: './match-room.component.css'
})
export class MatchRoomComponent implements OnInit {
  currentState: PageState;

  constructor(private routeService: RoutingService,
              private activatedRoute: ActivatedRoute,
  ) {
    this.currentState = new ReadOnlyState();
  }
  ngOnInit(): void {
    // this.loadMyMatch();
    this.setCurrentStateBasedOnRouteData()
  }

  routeBackToHome() {
    this.routeService.redirectTo('home', false);
  }
  getMatchIdByRoute(){
    return this.activatedRoute.snapshot.paramMap.get('id');
  }
  isCurrentUserOwner(){
    if (this.currentState.isOwnerState()) {
      const myMatchId = localStorage.getItem(STORAGE_KEYS.MY_MATCH_ID);
      if (myMatchId) {
        return myMatchId === this.getMatchIdByRoute();
      }
    }
    return false;
  }

  setCurrentStateBasedOnRouteData(){
    this.activatedRoute.data
      .subscribe(data => {
        switch (data['state']) {
          case MATCH_ROOM_STATE_KEYS.PARTICIPANT_STATE:
            this.currentState = new ParticipatingState();
            break;
          case MATCH_ROOM_STATE_KEYS.OWNER_STATE:
            this.currentState = new OwnerState();
            break;
            default:
            this.currentState = new ReadOnlyState();
            break;
        }
      });
  }

}
