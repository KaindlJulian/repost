import { Content } from './Content';
import { InstagramChat } from './InstagramChat';

export enum MessageType {
  ChangeScheduleMessage,
  CreatePostMessage,
  AddSubredditMessage,
  GetInstagramChatsMessage,
  SendInstagramChatsMessage,
}

export interface ProcessMessage {
  type: MessageType;
  value?: any;
}

export interface ChangeScheduleMessage extends ProcessMessage {
  type: MessageType.ChangeScheduleMessage;
  value: string;
}

export interface AddSubredditMessage extends ProcessMessage {
  type: MessageType.AddSubredditMessage;
  value: string[];
}

export interface CreatePostMessage extends ProcessMessage {
  type: MessageType.CreatePostMessage;
  value: Content | undefined;
}

export interface GetInstagramChatsMessage extends ProcessMessage {
  type: MessageType.GetInstagramChatsMessage;
}
export interface SendInstagramChatsMessage extends ProcessMessage {
  type: MessageType.SendInstagramChatsMessage;
  value: InstagramChat[];
}
