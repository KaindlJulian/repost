import { BotOptions } from '../types/BotOptions';
import { InstagramCredentials } from '../types/InstagramCredentials';
import * as cron from 'cron';

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
  job: cron.CronJob;

  constructor(args: BotOptions) {
    this.instagramCredentials = args.instagramCredentials;
    this.schedule = args.schedule;
    this.subreddit = {
      name: args.subreddit,
      url: `${REDDIT_URL}${args.subreddit}`,
    };
    this.job = cron.job(
      this.schedule,
      () => this.tick,
      undefined,
      false,
      TIME_ZONE,
    );
  }

  /**
   * Start the cron job
   */
  start() {
    this.job.start();
  }

  /**
   * End the cron job
   */
  stop() {
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
