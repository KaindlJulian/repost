import { launch, Page } from 'puppeteer';
import { Content, ContentType } from '../../types';
import { LAUNCH_OPTIONS } from './task.config';
import { Cache } from '../Cache';
import { logger } from '../../logger';

/**
 * Tries to get a gif/video (in this order) and text from a subreddit.
 * Resolves to undefined if no content was found.
 */
export async function getVideoContent(
  redditUrl: string
): Promise<Content | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  await page.browserContext().overridePermissions(redditUrl, []);

  await page.goto(redditUrl, { waitUntil: 'networkidle2', timeout: 0 });
  await page.waitFor(3000);

  // check if subreddit exists
  const cakeDay = await page.$('div[id*="CakeDay"]');
  if (!cakeDay) {
    return undefined;
  }

  const content = [
    ...(await getRedditGifs(page)),
    ...(await getImgurVideos(page)),
    // TODO: getGiphyVideos
  ];

  browser.close();

  if (!content) {
    return undefined;
  }

  return content[0];
}

/**
 * Will fetch all the reddit gifs and convert them to content
 * Returned Content is filtered, not in the cache
 */
async function getRedditGifs(page: Page): Promise<Content[]> {
  logger.info('Getting reddit gifs');
  const handles = await page.$$('source[src*="gif"]');

  const filtered = handles.filter(async (handle) => {
    const data = await handle.evaluate((e) => {
      return e.getAttribute('src')!;
    });
    !Cache.instance.has(data);
  });

  const gifType = ContentType.Gif;

  return await Promise.all(
    filtered.map(async (handle) => {
      return (await handle.evaluate(async (e, gifType) => {
        e.parentElement?.click();
        const url = e.getAttribute('src')!;
        const title = document.querySelectorAll('h1')[1].textContent;
        return {
          url: url.replace('preview', 'i').split('?')[0],
          type: gifType,
          caption: title,
        };
      }, gifType)) as Content;
    })
  );
}

/**
 * Fetches all the imgur videos as content object
 * Returned Content is filtered, not in the cache
 */
async function getImgurVideos(page: Page): Promise<Content[]> {
  logger.info('Getting imgur videos');
  const handles = await page.$$('a[href*="gifv"][class]');

  const filtered = handles.filter(async (handle) => {
    const data = await handle.evaluate((e) => {
      return e.getAttribute('href')!;
    });
    !Cache.instance.has(data);
  });

  return await Promise.all(
    filtered.map(async (handle) => {
      await page.waitFor(1000);
      await page.goto(await handle.evaluate((e) => e.getAttribute('href')!));
      await page.waitFor(1000);

      return {
        url: page.url().replace('gifv', 'mp4'),
        type: ContentType.Video,
        caption: await page.title(),
      } as Content;
    })
  );
}
