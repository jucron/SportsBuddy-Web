import {Component} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-match-room-chat',
  standalone: true,
  imports: [
    FlexModule,
    MatToolbar,
    MatCard
  ],
  templateUrl: './match-room-chat.component.html',
  styleUrl: './match-room-chat.component.css'
})
export class MatchRoomChatComponent {

}
