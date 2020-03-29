import { Content } from './Content';

export enum MessageType {
  ChangeScheduleMessage,
  CreatePostMessage,
  AddSubredditMessage,
}

export interface ProcessMessage {
  type: MessageType;
  value: any;
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
