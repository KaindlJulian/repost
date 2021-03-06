import { CronJob, CronTime } from 'cron';
import { logger } from '../logger';
import { Cache } from './Cache';
import { Randomizer } from './Randomizer';
import {
  BotOptions,
  InstagramCredentials,
  Subreddit,
  CycleArray,
  Content,
} from '../types';
import {
  downloadContent,
  createInstagramPost,
  getImageContent,
  exploreAndLike,
  collectChats,
  loginCreatorStudio,
  getVideoContent,
} from './tasks';
import { sendInstagramChats } from '../pm2';
import { cleanUpDownloadFolder } from '../utils';

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
const TIME_ZONE = process.env.TIME_ZONE || 'Europe/Vienna';
const REDDIT_URL = 'https://www.reddit.com/r/';

export class Bot {
  /**
   * Where the ig account details are stored
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
   * The cron explore job instance
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

    const subreddits: Subreddit[] = args.subredditNames.map((n) => {
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
      this.exploreJob = new CronJob('0 12 * * *', () => {
        exploreAndLike(this.instagramCredentials, this.randomizer);
        this.randomizeNextExploreSchedule();
      });
    }

    logger.info('New Bot created', {
      username: args.instagramCredentials.username,
      subreddits: args.subredditNames,
      schedule: args.schedule,
      tags: args.tags,
      explore: args.explore,
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
   * Set a new bot job schedule
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
    const subs = names.map((n) => {
      return {
        name: n,
        url: `${REDDIT_URL}${n}`,
      };
    });

    this.subreddits.push(...subs);
  }

  /**
   * Collects instagram direct message chats and sends them to the api
   */
  async getInstagramChats() {
    const chats = await collectChats(this.instagramCredentials);
    sendInstagramChats('api', chats);
  }

  /**
   * Create a new post with content or search for content
   */
  async createPost(content?: Content) {
    logger.info('Creating new post from endpoint', content);
    if (!content) {
      this.tick();
    } else {
      const postableContent = await downloadContent(content);
      if (postableContent) {
        const page = await loginCreatorStudio(this.instagramCredentials);
        if (page) {
          await createInstagramPost(page, postableContent, this.tags);
        }
      }
    }
  }

  /**
   * Changes next job schedule for the explore job
   */
  private randomizeNextExploreSchedule() {
    const minute = this.randomizer.number(0, 59);
    const hour = this.randomizer.number(6, 24);
    const newSchedule = `${minute} ${hour} * * *`; // every day at hour:minute
    try {
      this.exploreJob?.setTime(new CronTime(newSchedule));
    } catch (error) {
      logger.error('Could not set new schedule', error);
    }
  }

  /**
   * Executed by the cron job, runs every schedule. Executes the tasks required to create a new
   * instagram post
   */
  private async tick() {
    const subreddit = this.subreddits.cycle();
    const shouldPostVideo = this.randomizer.evaluatePercentage(0.33);

    const imageContent = await getImageContent(subreddit.url);
    const videoContent = await getVideoContent(subreddit.url);

    let content: Content | undefined;
    if (shouldPostVideo) {
      content = videoContent ? videoContent : imageContent;
    } else {
      content = imageContent ? imageContent : videoContent;
    }

    if (!content) {
      logger.info('No content found, skipping schedule', subreddit);
      return;
    }

    const postableContent = await downloadContent(content);

    if (postableContent) {
      const page = await loginCreatorStudio(this.instagramCredentials);
      if (page) {
        await createInstagramPost(page, postableContent, this.tags);
      }
    }

    await cleanUpDownloadFolder();
  }
}
