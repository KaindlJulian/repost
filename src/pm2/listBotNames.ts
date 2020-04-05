import pm2 from 'pm2';
import { logger } from '../logger';

export function listBotNames(): Promise<string[]> {
  return new Promise((resolve) => {
    pm2.connect(true, (err) => {
      if (err) {
        logger.error('PM2 Connect Error', err);
        throw err;
      }

      pm2.list((err, descriptionList) => {
        if (err) {
          logger.error('PM2 List Error', err);
          throw err;
        }

        resolve(
          descriptionList.filter((d) => d.name !== 'api').map((d) => d.name!)
        );
      });
    });
  });
}
