import cron from 'cron';
import fetch from 'node-fetch';

const EVERY_TEN_MINUTES = '*/10 * * * *';

export function keepalive() {
  new cron.CronJob(EVERY_TEN_MINUTES, () => {
    fetch('https://ig-repost-bot.herokuapp.com/');
  });
}
