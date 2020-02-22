import { sendMessageToProcess } from './sendMessageToProcess';
import { AddSubredditMessage, MessageType } from '../../types';

/**
 * Add subreddits to a given bot
 */
export function addSubreddits(name: string, subreddits: string[]) {
  const message: AddSubredditMessage = {
    type: MessageType.AddSubredditMessage,
    value: subreddits,
  };
  sendMessageToProcess(name, message);
}
