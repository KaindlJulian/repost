import { sendMessageToProcess } from './sendMessageToProcess';
import {
  MessageType,
  InstagramChat,
  SendInstagramChatsMessage,
} from '../../types';

/**
 * Send chat data to a process
 */
export function sendInstagramChats(name: string, chats: InstagramChat[]) {
  const message: SendInstagramChatsMessage = {
    type: MessageType.SendInstagramChatsMessage,
    value: chats,
  };
  sendMessageToProcess(name, message);
}
