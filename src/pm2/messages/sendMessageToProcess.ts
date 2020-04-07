import pm2 from 'pm2';
import { logger } from '../../logger';
import { ProcessMessage } from '../../types';

export function sendMessageToProcess(name: string, message: ProcessMessage) {
  // connect to pm2
  pm2.connect((err) => {
    if (err) {
      logger.error('PM2 Connect Error', err);
    }

    // get a list of running apps
    pm2.list((err, list) => {
      if (err) {
        logger.error('PM2 List Error', err);
      }

      // filter by name
      const filteredList = list.filter((p) => p.name === name);

      if (!filteredList) {
        logger.warn('PM2 Bot not found');
        return;
      }

      // send the message
      pm2.sendDataToProcessId(
        filteredList[0].pm_id!,
        {
          type: 'process:msg',
          data: message,
          topic: 'bot',
        },
        (err) => {
          if (err) {
            logger.error('PM2 Message Error', err);
          }
        }
      );
    });
  });
}
