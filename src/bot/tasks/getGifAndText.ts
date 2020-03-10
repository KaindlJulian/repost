import { launch } from 'puppeteer';
import { Content } from '../../types';
import { LAUNCH_OPTIONS } from './task.config';

/**
 * Tries to get gif and text from a subreddit
 */
export async function getGifAndText(
  redditUrl: string
): Promise<Content | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  page.goto(redditUrl);
}
