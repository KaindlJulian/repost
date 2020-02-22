export enum MessageType {
  ChangeScheduleMessage,
  AddSubredditMessage,
}

interface BaseProcessMessage {
  type: MessageType;
}

export interface ChangeScheduleMessage extends BaseProcessMessage {
  type: MessageType.ChangeScheduleMessage;
  value: string;
}

export interface AddSubredditMessage extends BaseProcessMessage {
  type: MessageType.AddSubredditMessage;
  value: string[];
}
