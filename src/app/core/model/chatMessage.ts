import {Account} from "./account";
import {MessageStatus} from "./messageStatus";
import {MessageType} from "./messageType";

export interface ChatMessage {
  id: string;
  sender: Account;
  text: string;
  timestamp: Date;
  status: MessageStatus
  type: MessageType;
}

