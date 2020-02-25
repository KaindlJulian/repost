import pm2 from 'pm2';
import { logger } from './logger';
import * as bots from '../bots';

pm2.connect(err => {
  if (err) {
    logger.error('PM2 Connect Error', err);
  }

  // start all the bots
  Object.values(bots).forEach(bot => {
    pm2.start({ ...bot, script: './bot/index.js' }, err => {
      if (err) {
        logger.error('PM2 App Startup error', { pm2: err, bot: bot.name });
      }
    });
  });
});
