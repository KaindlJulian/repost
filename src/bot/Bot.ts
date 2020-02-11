import { logger } from '../logger';
import { BotOptions, InstagramCredentials } from '../types';
import { CronJob } from 'cron';
import { getImageAndText } from './tasks/getImageAndText';
import { createInstagramPost } from './tasks/createInstagramPost';

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

  /**
   * Creates an instance of Bot.
   */
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
   * Executed by the cron job. Executes the tasks required to create a new
   * instagram post
   */
  private async tick() {
    const content = await getImageAndText(this.subreddit.url);
    if (content) {
      logger.info('creating post with with', content);
      await createInstagramPost(this.instagramCredentials, content);
    } else {
      logger.error('no content found, exiting', {
        subreddit: this.subreddit.url,
      });
      this.stop();
      process.exit(1);
    }
  }
}
