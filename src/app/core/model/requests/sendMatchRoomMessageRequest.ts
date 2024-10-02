import {ChatMessage} from "../chatMessage";

export interface SendMatchRoomMessageRequest {
  matchId: string;
  senderId: string;
  message: ChatMessage;
}
