import {ChatMessage} from "./chatMessage";

export interface ChatData {
  chatMessages: ChatMessage[];
  isChatActive: boolean;
  chatStartTime: Date;
}
