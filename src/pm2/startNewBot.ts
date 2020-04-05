import pm2 from 'pm2';
import { logger } from '../logger';
import { generatePm2Config } from '../utils';
import { BotOptions } from '../types';
import { writePm2ConfigToFile } from '../utils/writePm2ConfigToFile';

/**
 * Start a new Bot with name and options managed by pm2
 */
export function startNewBot(name: string, options: BotOptions) {
  pm2.connect(true, (err) => {
    if (err) {
      logger.error('PM2 Connect Error', err);
      throw err;
    }

    const config = generatePm2Config(name, options);

    pm2.start(config, (err) => {
      if (err) {
        logger.error('PM2 App Startup error', err);
      } else {
        writePm2ConfigToFile(config);
      }
    });
  });
}
