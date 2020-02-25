import pm2 from 'pm2';
import { logger } from '../logger';
import { BotStatus } from '../types';

/**
 * Collect pm2 process information about a bot
 */
export function getBotStatus(name: string): Promise<BotStatus> {
  return new Promise(resolve => {
    pm2.connect(err => {
      if (err) {
        logger.error('PM2 Connect Error', err);
        throw err;
      }

      pm2.describe(name, (err, proc) => {
        if (err) {
          logger.error('PM2 Describe Error', err);
          return;
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
