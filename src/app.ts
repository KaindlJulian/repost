import pm2 from 'pm2';
import { logger } from './logger';

pm2.connect(err => {
  if (err) {
    logger.error('PM2 Connect Error', err);
  }

  // we aim to have a mostly empty ecosystem file (at least no bots, maybe the api)
  // we start all the bots from some config files here (like /bots/*.js are bot configs with pm2 ecosystem file structure)
  // if the api is started from ecosystem file before this we disconnect now, else we first start the api
});

// we expose some functions the api needs (functions will look similar: connect, start/stop/restart, disconnect)
