import {Match} from "./match";
import {Account} from "./account";

export interface Chat {
  id: string,
  match: Match,
  messages: ChatMessage[]
}
export interface ChatMessage {
  id: string,
  sendDate: Date,
  chat: Chat
  sender: Account,
  message: string
  status: MessageStatus
}
export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ"
}
