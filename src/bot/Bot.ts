import { CronJob } from 'cron';
import { logger } from '../logger';
import { CycleArray } from '../utils';
import { BotOptions, InstagramCredentials, Subreddit } from '../types';
import { createInstagramPost, getImageAndText } from './tasks';
import { Cache } from './Cache';

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days in seconds
const TIME_ZONE = process.env.TIME_ZONE || 'Europe/Vienna';
const REDDIT_URL = 'https://www.reddit.com/r/';

export class Bot {
  /**
   * Where the account details are stored
   */
  private instagramCredentials: InstagramCredentials;

  /**
   * Name and url of the subreddits
   */
  readonly subreddits: CycleArray<Subreddit>;

  /**
   * The cron job instance
   */
  readonly job: CronJob;

  /**
   * List of tags to add on each post
   */
  readonly tags: string[];

  constructor(args: BotOptions) {
    Cache.createInstance(CACHE_TTL);

    this.instagramCredentials = args.instagramCredentials;
    this.tags = args.tags;

    const subreddits: Subreddit[] = args.subredditNames.map(n => {
      return {
        name: n,
        url: `${REDDIT_URL}${n}`,
      };
    });

    this.subreddits = new CycleArray(...subreddits);

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
      reddit: args.subredditNames,
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
    const subreddit = this.subreddits.cycle();
    const content = await getImageAndText(subreddit.url);
    if (content) {
      logger.info('Creating post with with', content);
      await createInstagramPost(this.instagramCredentials, content);
    } else {
      logger.error('No content found, shutting down the bot.', {
        subreddit: subreddit.url,
      });
      this.stop();
      process.exit(1);
    }
  }
}
