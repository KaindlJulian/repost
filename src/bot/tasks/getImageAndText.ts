import { launch } from 'puppeteer';
import { Cache } from '../cache';
import { logger } from '@/logger';
import { PostContent } from '@/types';

export async function getImageAndText(
  redditUrl: string
): Promise<PostContent | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();

  page.goto(redditUrl);

  try {
    // wait until image posts are loaded
    await page.waitForSelector('img.ImageBox-image.media-element', {
      visible: true,
      timeout: 3000,
    });
    await page.waitFor(1000);
  } catch (err) {
    logger.error(
      `${err}. The subreddit '${redditUrl}' might not exist or doesnt contain any image posts.`
    );
    return undefined;
  }

  // get all image posts
  const imagePosts = await page.$$('img.ImageBox-image.media-element');

  // filter out ads and already used posts
  const filteredPosts = await imagePosts.filter(async p => {
    return await p.evaluate(e => {
      return (
        e.getAttribute('target') !== '_blank' &&
        (e.getAttribute('src')
          ? Cache.instance?.has(e.getAttribute('src')!)
          : false)
      );
    });
  });

  // click image to open popup
  await filteredPosts[0].click();
  await page.waitFor(1000);

  const data = await page.evaluate(async () => {
    const title = document.querySelectorAll('h1')[1].textContent;
    const image = await filteredPosts[0].evaluate(e => e.getAttribute('src'));

    if (image && title) {
      return {
        imageUrl: image.replace('preview', 'i'),
        caption: title,
      };
    } else {
      return undefined;
    }
  });

  await browser.close();

  return data;
}
