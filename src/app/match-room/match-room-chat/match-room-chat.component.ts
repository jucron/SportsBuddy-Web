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
import {SESSION_KEYS} from "../../core/keys/session-keys";
import {DialogService} from "../../core/dialog/dialog.service";
import {MatchService} from "../../core/integration/match.service";
import {ChatMessage} from "../../core/model/chatMessage";
import {UIServiceParams} from "../../core/integration/ui-features/ui-service-params";
import {IntegrationUiService} from "../../core/integration/ui-features/integration-ui.service";
import {ChatData} from "../../core/model/chatData";

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
              private accountService: AccountService,
              private dialogService: DialogService,
              private matchService: MatchService,
              private integrationUIService: IntegrationUiService) {
    this.chatRoomForm = this.factoryService.getFormFactory().createChatRoomForm();
    this.userId = this.accountService.getLoggedAccountId()
  }

  ngOnInit(): void {
    this.generateUserColors();
  }

  onSubmit() {
    if (this.isChatRoomFormValid()) {
      let message: ChatMessage = this.chatRoomForm.value;
      const userId = this.accountService.getLoggedAccountId();
      if (message && this.match && userId) {
        this.dialogService.confirmActionByDialog('send this message')
          .subscribe(result => {
            if (result && this.match) {
              const matchId = this.match.id;
              let params = UIServiceParams.builder().withErrorAlert().withLoadingDialog().withSuccessAlert();
              let operation = this.matchService.sendMatchRoomMessage(matchId, userId, message);
              this.integrationUIService.executeCall<ChatData>(operation, params)
                .subscribe(chatData => {
                  if (chatData) {
                    this.match!.chatData = chatData;
                  }
                });
              this.chatRoomForm.reset();
            }
          });
      }
    }
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
    //getting user colors from local storage if they exist
    let userColors = sessionStorage.getItem(SESSION_KEYS.USER_COLORS_KEY);
    if (userColors) {
      this.userColors = new Map(JSON.parse(userColors));
    } else {
      this.userColors = new Map();
    }
    let chatMessages = this.match?.chatData?.chatMessages;
    if (chatMessages) {
      chatMessages.forEach(chatMessage => {
        let userId = chatMessage.sender.id;
        if (!this.userColors.has(userId)) {
          this.userColors.set(userId, this.getRandomColor());
        }
      });
    }
    //saving user colors to local storage
    sessionStorage.setItem(SESSION_KEYS.USER_COLORS_KEY, JSON.stringify(Array.from(this.userColors.entries())));
    this.isLoadingColors = false;
  }

  getUserAssignedColor(userId: string, isSecondTry: boolean = false): string {
    if (this.userColors.has(userId)) {
      return this.userColors.get(userId) || '';
    }
    if (isSecondTry) {
      //if this is reached, the generation of colors is not working properly
      return '';
    }
    this.generateUserColors();
    return this.getUserAssignedColor(userId, true);
  }

  protected isCurrentUserMessage(userId: string): boolean {
    if (!this.userId) {
      this.userId = this.accountService.getLoggedAccountId();
    }
    return this.userId === userId;
  }

  isChatRoomFormValid() {
    let message: ChatMessage = this.chatRoomForm.value;
    //check if text is not empty or null or undefined
    return message && message.text && message.text.trim() !== '';
  }
}
