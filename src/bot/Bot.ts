import { logger } from '../logger';
import { BotOptions, InstagramCredentials } from '../types';
import { CronJob } from 'cron';

const REDDIT_URL = 'https://www.reddit.com/r/';
const TIME_ZONE = process.env.TIME_ZONE || 'Europe/Vienna';

export class Bot {
  /**
   * Where the account details are stored
   */
  private instagramCredentials: InstagramCredentials;

  /**
   * Name and url of the subreddit
   */
  readonly subreddit: {
    name: string;
    url: string;
  };

  /**
   * Changeable schedule string.
   * More on http://crontab.org/
   */
  schedule: string;

  /**
   * The job instance
   */
  job: CronJob;

  constructor(args: BotOptions) {
    this.instagramCredentials = args.instagramCredentials;
    this.schedule = args.schedule;
    this.subreddit = {
      name: args.subreddit,
      url: `${REDDIT_URL}${args.subreddit}`,
    };
    this.job = new CronJob(
      this.schedule,
      () => {
        this.tick();
      },
      undefined,
      false,
      TIME_ZONE
    );

    logger.info('New Bot created', {
      reddit: args.subreddit,
      schedule: args.schedule,
    });
  }

  /**
   * Start the cron job
   */
  start() {
    this.job.start();
    logger.info('Bot started');
  }

  /**
   * End the cron job
   */
  stop() {
    logger.info('Bot stopped');
    this.job.stop();
  }

  /**
   * Executed by the cron job
   */
  tick() {
    // open reddit
    // get some image and text
    // login to instagram account
    // create new post
  }
}
