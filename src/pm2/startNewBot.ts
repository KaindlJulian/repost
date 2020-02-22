import pm2 from 'pm2';
import { logger } from '../logger';
import { generatePm2Config } from '../utils';
import { BotOptions } from '../types';

/**
 * Start a new Bot with name and options managed by pm2
 */
export function startNewBot(name: string, options: BotOptions) {
  pm2.connect(err => {
    if (err) {
      logger.error('PM2 Connect Error', err);
    }

    pm2.start(generatePm2Config(name, options), err => {
      if (err) {
        logger.error('PM2 App Startup error', err);
      }
    });
  });
}
