import {Component, Input, OnInit} from '@angular/core';
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
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
import {AccountService} from "../../core/integration/account.service";

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
    NgForOf,
    ExtendedModule
  ],
  templateUrl: './match-room-chat.component.html',
  styleUrl: './match-room-chat.component.css'
})
export class MatchRoomChatComponent implements OnInit {
  chatRoomForm: FormGroup;
  @Input() match: Match | null = null;
  userColors = new Map<string, string>();
  protected isLoadingColors: boolean = true;
  private userId: string | null = null;

  constructor(private factoryService: FactoryService,
              private accountService: AccountService) {
    this.chatRoomForm = this.factoryService.getFormFactory().createChatRoomForm();
    this.userId = this.accountService.getLoggedAccountId()
  }

  ngOnInit(): void {
    this.generateUserColors();
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
  getRandomColor(): string {
    const letters = '89ABCDEF'; // Use only bright values
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  private generateUserColors() {
    this.isLoadingColors = true;
    let chatMessages = this.match?.chatData?.chatMessages;
    if (chatMessages) {
      chatMessages.forEach(chatMessage => {
        let userId = chatMessage.sender.id;
        if (!this.userColors.has(userId)) {
          this.userColors.set(userId, this.getRandomColor());
        }
      });
    }
    this.isLoadingColors = false;
  }

  getUserAssignedColor(userId: string): string {
    let result = '';
    if (this.match) {
      if (this.userColors.has(userId)) {
        result = this.userColors.get(userId) || '';
      }
    }
    return result;
  }

  protected isCurrentUserMessage(userId: string): boolean {
    if (!this.userId) {
      this.userId = this.accountService.getLoggedAccountId();
    }
    return this.userId === userId;
  }
}
