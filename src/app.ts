import dotenv from 'dotenv';
import pm2 from 'pm2';
import { logger } from './logger';
import * as bots from '../bots';

dotenv.config();

pm2.connect(err => {
  if (err) {
    logger.error('PM2 Connect Error', err);
  }

  // start all the bots
  Object.values(bots).forEach(bot => {
    pm2.start({ ...bot, script: './bot/index.js' }, err => {
      if (err) {
        logger.error('PM2 Bot Startup error', { pm2: err, bot: bot.name });
      }
    });
  });

  // start the api
  pm2.start(
    {
      name: 'api',
      script: './api/index.js',
      exec_mode: 'cluster',
      merge_logs: true,
      env: {
        API_KEY: process.env.API_KEY || 'unset',
      },
    },
    err => {
      if (err) {
        logger.error('PM2 Api Startup error', { pm2: err });
      }
    }
  );
});
