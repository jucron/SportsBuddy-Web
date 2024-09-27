import {ChatMessage} from "./chatMessage";
import {Match} from "./match";
import {ChatDataType} from "./chatDataType";

export interface ChatData {
  chatMessages: ChatMessage[];
  // isChatActive: boolean;
  // chatStartTime: Date;
  match: Match;
  chatDataType: ChatDataType
}
