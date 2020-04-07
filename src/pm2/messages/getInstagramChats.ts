import { sendMessageToProcess } from './sendMessageToProcess';
import { MessageType, GetInstagramChatsMessage } from '../../types';

/**
 * Signal a process to collect chat data
 */
export function getInstagramChats(name: string) {
  const message: GetInstagramChatsMessage = {
    type: MessageType.GetInstagramChatsMessage,
  };
  sendMessageToProcess(name, message);
}
