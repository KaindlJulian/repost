export enum MessageType {
  ChangeScheduleMessage,
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
