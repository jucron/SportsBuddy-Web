import {ChatData} from "../chatData";

export interface SendMatchRoomMessageResponse {
  message: string;
  chatData: ChatData | null;
}
