import pm2 from 'pm2';
import { logger } from '../logger';
import { BotStatus } from '../types';

/**
 * Collect pm2 process information about a bot
 */
export function getBotStatus(name: string): Promise<BotStatus> {
  return new Promise((resolve, reject) => {
    if (name === 'api') {
      reject('Access to api not allowed');
    }

    pm2.connect(true, (err) => {
      if (err) {
        logger.error('PM2 Connect Error', err);
        reject(err);
      }

      pm2.describe(name, (err, proc) => {
        if (err) {
          logger.error('PM2 Describe Error', err);
          reject(err);
        }

        const description = proc[0];

        resolve({
          status: description.pm2_env?.status || 'unknown',
          env: {
            instances:
              description.pm2_env?.instances === 'max'
                ? 1
                : description.pm2_env?.instances || -1,
            uptime: description.pm2_env?.pm_uptime || -1,
          },
          monit: {
            memory: description.monit?.memory || -1,
            cpu: description.monit?.cpu || -1,
          },
        });
      });
    });
  });
}
