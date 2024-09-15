import {Account} from "./account";

export interface ChatMessage {
  id: string;
  sender: Account;
  text: string;
  timestamp: Date;
  // type: MessageType; // Message type (e.g., 'text', 'image', etc.)
  // status?: MessageStatus; //Message status (e.g., "sent", "delivered", "read").
}
