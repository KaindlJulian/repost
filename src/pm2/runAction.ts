import pm2 from 'pm2';
import { logger } from '../logger';
import { Pm2ProcessAction } from '../types';

/**
 * Run a `Pm2ProcessAction` on a given bot
 */
export function runAction(name: string, action: Pm2ProcessAction) {
  pm2.connect(err => {
    if (err) {
      logger.error('PM2 Connect Error', err);
    }

    switch (action) {
      case Pm2ProcessAction.Restart:
        pm2.restart(name, err => {
          if (err) {
            logger.error('PM2 Bot Action error', err);
          }
        });
        break;
      case Pm2ProcessAction.Stop:
        pm2.stop(name, err => {
          if (err) {
            logger.error('PM2 Bot Action error', err);
          }
        });
        break;
      case Pm2ProcessAction.Delete:
        pm2.delete(name, err => {
          if (err) {
            logger.error('PM2 Bot Action error', err);
          }
        });
        break;
    }
  });
}
