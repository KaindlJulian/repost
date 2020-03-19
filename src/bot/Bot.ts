import { CronJob, CronTime } from 'cron';
import { logger } from '../logger';
import { CycleArray } from '../utils';
import { BotOptions, InstagramCredentials, Subreddit } from '../types';
import { Cache } from './Cache';
import { Randomizer } from './Randomizer';
import {
  createInstagramPost,
  getImageContent,
  downloadContent,
  getVideoContent,
} from './tasks';
import { exploreAndLike } from './tasks/exploreAndLike';

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
   *
   */
  private exploreJob?: CronJob;

  /**
   * Bot randomizer
   */
  private randomizer: Randomizer;

  /**
   * List of tags to add on each post
   */
  readonly tags: string[];

  constructor(args: BotOptions) {
    Cache.createInstance(CACHE_TTL);

    this.instagramCredentials = args.instagramCredentials;
    this.tags = args.tags;
    this.randomizer = Randomizer.getInstance().setSeed(
      this.instagramCredentials.username
    );

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

    if (args.explore) {
      this.exploreJob = new CronJob(
        '0 10 * * 0,2,4',
        () => {
          exploreAndLike(this.instagramCredentials, this.randomizer);
        },
        undefined,
        false,
        TIME_ZONE
      );
    }

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
    this.exploreJob?.start();
    logger.info('Bot started');
  }

  /**
   * End the cron job
   */
  stop() {
    logger.info('Bot stopped');
    this.job.stop();
    this.exploreJob?.stop();
  }

  /**
   * Set a new bot schedule
   */
  changeSchedule(newSchedule: string) {
    try {
      this.job.setTime(new CronTime(newSchedule));
    } catch (error) {
      logger.error('Could not set new schedule', error);
    }
  }

  /**
   * Add new subreddits
   */
  addSubreddits(names: string[]) {
    const subs = names.map(n => {
      return {
        name: n,
        url: `${REDDIT_URL}${n}`,
      };
    });

    this.subreddits.push(...subs);
  }

  /**
   * Executed by the cron job, runs every schedule. Executes the tasks required to create a new
   * instagram post
   */
  private async tick() {
    const subreddit = this.subreddits.cycle();
    const content = this.randomizer.evaluatePercentage(0.25)
      ? await getVideoContent(subreddit.url)
      : await getImageContent(subreddit.url);

    if (!content) {
      logger.info('No content found, skipping the schedule.', {
        subreddit: subreddit.url,
      });
      return;
    }

    const postableContent = await downloadContent(content);

    if (postableContent) {
      await createInstagramPost(
        this.instagramCredentials,
        postableContent,
        this.tags
      );
    }
  }
}
