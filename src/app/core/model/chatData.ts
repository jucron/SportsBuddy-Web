import {ChatMessage} from "./chatMessage";
import {ChatDataType} from "./chatDataType";

export interface ChatData {
  chatMessages: ChatMessage[];
  // isChatActive: boolean;
  // chatStartTime: Date;
  chatDataType: ChatDataType
}
