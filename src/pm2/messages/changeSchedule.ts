import { sendMessageToProcess } from './sendMessageToProcess';
import { ChangeScheduleMessage, MessageType } from '../../types';

/**
 * Change the schedule of a given bot
 */
export function changeSchedule(name: string, newSchedule: string) {
  const message: ChangeScheduleMessage = {
    type: MessageType.ChangeScheduleMessage,
    value: newSchedule,
  };
  sendMessageToProcess(name, message);
}
