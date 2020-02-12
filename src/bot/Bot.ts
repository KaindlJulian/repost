import { CronJob } from 'cron';
import { logger } from '../logger';
import { createInstagramPost, getImageAndText } from './tasks';
import { BotOptions, InstagramCredentials } from '../types';

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
    readonly name: string;
    readonly url: string;
  };

  /**
   * The cron job instance
   */
  readonly job: CronJob;

  /**
   * Creates an instance of Bot.
   */
  constructor(args: BotOptions) {
    this.instagramCredentials = args.instagramCredentials;
    this.subreddit = {
      name: args.subreddit,
      url: `${REDDIT_URL}${args.subreddit}`,
    };
    this.job = new CronJob(
      args.schedule,
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
      logger.error('No content found, shutting down the bot.', {
        subreddit: this.subreddit.url,
      });
      this.stop();
      process.exit(1);
    }
  }
}
