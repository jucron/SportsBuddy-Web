import {Component, Input} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard} from "@angular/material/card";
import {FormErrorComponent} from "../../core/helper-components/form-error/form-error.component";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgForOf} from "@angular/common";
import {FactoryService} from "../../core/factory/factory.service";
import {Match} from "../../core/model/match";
import {DateUtils} from "../../core/utils/dateUtils";

@Component({
  selector: 'app-match-room-chat',
  standalone: true,
  imports: [
    FlexModule,
    MatToolbar,
    MatCard,
    FormErrorComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './match-room-chat.component.html',
  styleUrl: './match-room-chat.component.css'
})
export class MatchRoomChatComponent {
  chatRoomForm: FormGroup;
  @Input() match: Match | null = null;

  constructor(private factoryService: FactoryService) {
    this.chatRoomForm = this.factoryService.getFormFactory().createChatRoomForm();
  }

  onSubmit() {
    //todo sendChatMessage
  }

  isChatMessagesEmpty() {
    let result = true;
    let chatMessages = this.match?.chatData?.chatMessages;
    if (chatMessages) {
      result = chatMessages.length === 0;
    }
    return result;
  }

  getMessageDateLabel(date: Date) {
    return DateUtils.getDateLabel(date);
  }
}
