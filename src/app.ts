import dotenv from 'dotenv';
import pm2 from 'pm2';
import path from 'path';
import { logger } from './logger';
import * as bots from '../bots';

dotenv.config();

pm2.connect(false, err => {
  if (err) {
    logger.error('PM2 Connect Error', err);
    process.exit(1);
  }

  // start all the bots
  Object.values(bots).forEach(bot => {
    pm2.start(
      { ...bot, script: path.join(__dirname, '/bot/index.js') },
      err => {
        if (err) {
          logger.error('PM2 Bot Startup error', {
            pm2: err.message,
            bot: bot.name,
          });
          throw err;
        }
      }
    );
  });

  // start the api
  pm2.start(
    {
      name: 'api',
      script: path.join(__dirname, '/api/index.js'),
      exec_mode: 'cluster',
      merge_logs: true,
      env: {
        API_KEY: process.env.API_KEY || '',
      },
    },
    err => {
      if (err) {
        logger.error('PM2 Api Startup error', { pm2: err.message });
        throw err;
      }
    }
  );

  // todo: convert callbacks to promises and await all
  setTimeout(() => {
    pm2.disconnect();
  }, 5000);
});
